import os
import boto3
from http import cookies
import json
from urllib import request, parse

from chalice import Chalice, Response
from chalice import CognitoUserPoolAuthorizer
from chalice.app import BadRequestError
from chalicelib import auth, db


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

def redirect(url, message):
    message = parse.urlencode(message).encode()
    return Response(body='Redirecting', status_code=302, headers={"Location": url + f"?flash={message}"})

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
    request = app.current_request
    if not request.query_params:
        message = "Login attempt missing critical data."
        return redirect(auth.client_index_url, message)
    
    token = auth.retrieve_token(request.query_params['code'], 'id_token')
    if token is False:
        message = "Identity token could not be retrieved."
        return redirect(auth.client_index_url, message)  

    token_claims = auth.verify_claims(token)
    if token_claims is False:
        message = "Token claims could not be verified."
        return redirect(auth.client_index_url, message)  

    # Now, the token has been successfully retrieved and verified, so we can pass it to the client
    # STRATEGY 1
    # For verifying on the server, but then passing code to client as a query parameter
    data = {
        "token": token,
        "flash": "Successfully logged in."
    }
    data = parse.urlencode(data).encode()
    print(data)

    return Response(body="Successful login", status_code=302, headers={"Location": f"https://eventadmin.ussba.io/index.html?{data}"})

    # STRATEGY 2
    # If verifying on client, then return the raw token
    # Remember to change callback url in Cognito console and code to https://eventadmin.ussba.io/index.html
    # return {'token': token}

    # STRATEGY 3
    # If using cookies, then return a secure cookie
    # Remember to change callback url in Cognito console and code to https://eventadmin.ussba.io/api/login
    # return Response(body="Redirecting to Index...",
    #                 status_code=302,
    #                 headers={
    #                     "Set-Cookie": f"eventadmin_access_token={id_token}; Path=/api; HttpOnly; Secure;",
    #                     "Location": "https://eventadmin.ussba.io/index.html"
    #                 })


@app.route('/test-cookie')
def set_cookie():
    return Response(body="Cookie set",
                    status_code=200,
                    headers={"Set-Cookie": "cat=maximillian"}
                    )


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
