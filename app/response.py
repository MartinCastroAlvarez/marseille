"""
Lambda Response Handler.
"""

import json

import constants


class Response:
    """
    Response Entity.
    """

    def __init__(self) -> None:
        """
        Constructor.
        """
        self.body: dict = dict()
        self.trace: list = list()
        self.error: str = str()
        self.code: str = constants.OK

    def to_json(self) -> dict:
        """
        JSON serializer.
        Always returns a 200 OK response code.
        """
        return {
            "statusCode": 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
            "body": json.dumps({
                constants.HEAD: {
                    constants.ERROR: self.error,
                    constants.VERSION: constants.APP_VERSION,
                    constants.TRACE: [
                        line
                        for line in self.trace
                        if line
                    ],
                    constants.CODE: self.code,
                },
                constants.BODY: self.body,
            })
        }

    def __repr__(self) -> str:
        """
        String serializer.
        """
        return "<{}: '{}'>".format(self.__class__.__name__, self.to_json())
