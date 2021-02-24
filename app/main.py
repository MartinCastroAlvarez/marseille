"""
Lambda Main Handlers.
"""

import logging
import traceback

from response import Response
from request import Request
from models import Password

import constants
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


def save(event: dict, context: object) -> dict:
    """
    Lambda Save Handler.
    """
    logger.info("Request | sf_event=%s | sf_context=%s", event, context)
    try:
        request: Request = Request(event)
        response: Response = Response()
        response.body = {
            constants.PASSWORD: Password.upsert(request).to_json(),
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


def details(event: dict, context: object) -> dict:
    """
    Lambda Details Handler.
    """
    logger.info("Request | sf_event=%s | sf_context=%s", event, context)
    try:
        request: Request = Request(event)
        response: Response = Response()
        response.body = {
            constants.PASSWORD: Password.get(request).to_json(),
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


def search(event: dict, context: object) -> dict:
    """
    Lambda Search Handler.
    """
    logger.info("Request | sf_event=%s | sf_context=%s", event, context)
    try:
        request: Request = Request(event)
        response: Response = Response()
        response.body = {
            constants.PASSWORDS: [
                p.to_json()
                for p in Password.search(request)
            ],
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


def init(event: dict, context: object) -> dict:
    """
    Lambda Init Handler.
    """
    logger.info("Request | sf_event=%s | sf_context=%s", event, context)
    try:
        response: Response = Response()
        response.body = Password.init()
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


def delete(event: dict, context: object) -> dict:
    """
    Lambda Delete Handler.
    """
    logger.info("Request | sf_event=%s | sf_context=%s", event, context)
    try:
        request: Request = Request(event)
        response: Response = Response()
        Password.delete(request)
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
