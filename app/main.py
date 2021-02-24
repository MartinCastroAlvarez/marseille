"""
Lambda Main Handlers.
"""

import logging
import requests
import traceback

from response import Response
from request import Request

import config
import constants
from botocore.exceptions import ClientError

logger: logging.RootLogger = logging.getLogger(__name__)


def products(event: dict, context: object) -> dict:
    """
    Lambda Products Search Handler.
    https://shopify.dev/docs/admin-api/rest/reference/products/product#index-2021-01
    """
    logger.info("Request | sf_event=%s | sf_context=%s", event, context)
    url: str = f"https://{config.USER}:{config.PASS}@{config.SHOP}"\
               ".myshopify.com/admin/api/2021-01/products.json"
    try:
        request: Request = Request(event)
        response: Response = Response()
        params: dict = {
            "limit": request.limit,
            "since_id": request.since_id,
            "title": request.search,
            "status": "active",
        }
        r: requests.Response = requests.get(url, params=params)
        if r.status_code != 200:
            raise RuntimeError("Failed to connect with Shopify:", r.status_code, r.text)
        response.body = {
            constants.PRODUCTS: r.json()['products']
        }
        logger.info("Response | sf_response=%s", response)
        return response.to_json()
    except ClientError as e:
        logger.exception("BOTO Error")
        error = Response()
        error.error = "{}: {}".format(type(e), e)
        error.trace = traceback.format_exc().split("\n")
        error.code = constants.WAIT
        return error.to_json()
    except Exception as e:
        logger.exception("Error")
        error = Response()
        error.error = "{}: {}".format(type(e), e)
        error.trace = traceback.format_exc().split("\n")
        error.code = constants.ISE
        return error.to_json()
