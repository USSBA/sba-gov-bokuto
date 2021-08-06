import os
import boto3

from chalice import Chalice, Response
from chalice import CognitoUserPoolAuthorizer
from chalice.app import BadRequestError
from chalicelib import db

app = Chalice(app_name='bokuto')
app.debug = True
_DB = None


def get_events_db():
    global _DB
    if _DB is None:
        _DB = db.DynamoDBEvents(
            boto3.resource('dynamodb').Table(
                os.environ['DYNAMODB_EVENTS_TABLE_NAME'])
        )
    return _DB


authorizer = CognitoUserPoolAuthorizer(
    os.environ['COGNITO_USER_POOL_NAME'], provider_arns=[os.environ['COGNITO_USER_POOL_ARN']])


@app.route('/')
def index():
    return {'introspect request': 'https://eventadmin.ussba.io/api/introspect',
            'login': 'https://eventadmin.ussba.io/api/login',
            'events': 'https://eventadmin.ussba.io/api/events [GET, POST]',
            'test dynamodb table': 'https://eventadmin.ussba.io/api/test-ddb',
            'test authorization': 'https://eventadmin.ussba.io/api/test-auth',
            }


@app.route('/login')
def login():
    return Response(body='hello login route!',
                    status_code=200,
                    headers={'Set-Cookie': 'access_token=blargh; Secure; HttpOnly; SameSite=Strict;'})


@app.route('/events', methods=['GET'])
def get_events():
    # username = get_authorized_username(app.current_request)
    return get_events_db().list_all_items()


@app.route('/events', methods=['POST'])
def add_new_event():
    request = app.current_request
    body = request.json_body

    try:
        return get_events_db().add_item(
            event=body,
            metadata=body.get('metadata'),
        )
    except KeyError as e:
        raise BadRequestError("Missing fields")


@app.route('/events/{eventid}', methods=['GET'])
def get_event(eventid):
    # username = get_authorized_username(app.current_request)
    return get_events_db().get_item(eventid)


@app.route('/events/{eventid}', methods=['DELETE'])
def delete_event(eventid):
    # username = get_authorized_username(app.current_request)
    return get_events_db().delete_item(eventid)


@app.route('/events/{eventid}', methods=['PUT'])
def update_event(eventid):
    body = app.current_request.json_body
    # username = get_authorized_username(app.current_request)
    get_events_db().update_item(
        eventid,
        event=body,
        status=body.get('status'),
        metadata=body.get('metadata'))
    # username=username)


# Testing routes

@app.route('/introspect')
def introspect():
    return app.current_request.to_dict()


@app.route('/test-ddb')
def test_ddb():
    resource = boto3.resource('dynamodb')
    table = resource.Table(os.environ['DYNAMODB_EVENTS_TABLE_NAME'])
    return table.name


@app.route('/test-auth', methods=['GET'], authorizer=authorizer)
def authenticated():
    return {"success": True}
