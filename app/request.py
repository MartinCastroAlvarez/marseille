"""
Lambda Request Handler.
"""

import json
import typing
import logging

import constants


class Request:
    """
    Request Entity.
    """

    BODY = "body"
    QUERY_STRING = "queryStringParameters"
    PATH_PARAMETERS = "pathParameters"
    STAGE_VARIABLES = "stageVariables"

    def __init__(self, request: typing.Optional[dict] = None) -> None:
        """
        Constructor.
        """
        self.request = request or {}
        # level = logging.DEBUG if self.debug else logging.INFO
        level = logging.INFO
        f = logging.Formatter('%(asctime)s - %(message)s')
        for k in logging.Logger.manager.loggerDict:  # type: ignore
            g = logging.getLogger(k)
            g.setLevel(level)
            for h in g.handlers:
                h.setFormatter(f)

    def to_json(self) -> dict:
        """
        JSON serializer.
        """
        return self.request

    def __repr__(self) -> str:
        """
        String serializer.
        """
        return "<{}: '{}'>".format(self.__class__.__name__, self.to_json())

    @property
    def id(self) -> str:
        """
        ID Property.
        """
        return self.request.get(self.PATH_PARAMETERS, {}).get(constants.ID, "")

    @property
    def body(self) -> dict:
        """
        Body Property.
        """
        return json.loads(self.request.get(self.BODY, "{}") or "{}")

    @property
    def page(self) -> int:
        """
        Page Property.
        """
        return int(self.body.get(constants.PAGE, 0))

    @property
    def limit(self) -> int:
        """
        Limit Property.
        """
        value = self.body.get(constants.LIMIT)
        return int(value or constants.DEFAULT_LIMIT)

    @property
    def search(self) -> str:
        """
        Search Keyword Property.
        """
        return self.body.get(constants.SEARCH, "")

    @property
    def debug(self) -> bool:
        """
        Debug Flag Property.
        """
        return self.body.get(constants.DEBUG, False)
