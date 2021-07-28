import os
import boto3

from chalice import Chalice
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
                os.environ['EVENTS_TABLE_NAME'])
        )
    return _DB

# def get_authorized_username(current_request):
#     return current_request.context['authorizer']['principalId']

authorizer = CognitoUserPoolAuthorizer(
    'PUBLIC', provider_arns=[os.environ['COGNITO_USER_POOL_ARN']])

@app.route('/')
def index():
    return {'eventadminapi': 'reached successfully!'}


@app.route('/introspect')
def introspect():
    return app.current_request.to_dict()

@app.route('/test-ddb')
def test_ddb():
    resource = boto3.resource('dynamodb')
    table = resource.Table(os.environ['EVENTS_TABLE_NAME'])
    return table.name

@app.route('/test-auth', methods=['GET'], authorizer=authorizer)
def authenticated():
    return {"success": True}

# List all events
@app.route('/events', methods=['GET'])
def get_events():
    # username = get_authorized_username(app.current_request)
    return get_events_db().list_all_items()

# Create a new event
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

# Return a single event
@app.route('/events/{eventid}', methods=['GET'])
def get_event(eventid):
    # username = get_authorized_username(app.current_request)
    return get_events_db().get_item(eventid)

# Delete an event
@app.route('/events/{eventid}', methods=['DELETE'])
def delete_event(eventid):
    # username = get_authorized_username(app.current_request)
    return get_events_db().delete_item(eventid)

# Update a single event
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
