from uuid import uuid4

from boto3.dynamodb.conditions import Key

DEFAULT_USERNAME = 'default'


class EventDB(object):
    def list_items(self):
        pass

    def add_item(self, description, metadata=None):
        pass

    def get_item(self, uid):
        pass

    def delete_item(self, uid):
        pass

    def update_item(self, uid, description=None, state=None, metadata=None):
        pass


class InMemoryEventDB(EventDB):
    def __init__(self, state=None):
        if state is None:
            state = {}
        self._state = state

    def list_all_items(self):
        all_items = []
        for username in self._state:
            all_items.extend(self.list_items(username))
        return all_items

    def list_items(self, username=DEFAULT_USERNAME):
        return list(self._state.get(username, {}).values())

    def add_item(self, description, metadata=None, username=DEFAULT_USERNAME):
        if username not in self._state:
            self._state[username] = {}
        uid = str(uuid4())
        self._state[username][uid] = {
            'uid': uid,
            'description': description,
            'state': 'unstarted',
            'metadata': metadata if metadata is not None else {},
            'username': username
        }
        return uid

    def get_item(self, uid, username=DEFAULT_USERNAME):
        return self._state[username][uid]

    def delete_item(self, uid, username=DEFAULT_USERNAME):
        del self._state[username][uid]

    def update_item(self, uid, description=None, state=None,
                    metadata=None, username=DEFAULT_USERNAME):
        item = self._state[username][uid]
        if description is not None:
            item['description'] = description
        if state is not None:
            item['state'] = state
        if metadata is not None:
            item['metadata'] = metadata


class DynamoDBEvents(EventDB):
    def __init__(self, table_resource):
        self._table = table_resource

    def list_all_items(self):
        response = self._table.scan()
        return response['Items']

    def list_items(self, username=DEFAULT_USERNAME):
        response = self._table.query(
            KeyConditionExpression=Key('username').eq(username)
        )
        return response['Items']

    def add_item(self, event, metadata=None, username=DEFAULT_USERNAME):
        eventid = str(uuid4())
        self._table.put_item(
            Item={
                'userID': username,
                'eventID': eventid,
                'contact_email': event['contact_email'],
                'contact_name': event['contact_name'],
                'contact_phone': event['contact_phone'],
                'district_office': event['district_office'],
                'event_cost': event['event_cost'],
                'event_description': event['event_description'],
                'event_title': event['event_title'],
                'event_type': event['event_type'],
                'event_status': event['event_status'],
                'location_city': event['location_city'],
                'location_name': event['location_name'],
                'location_street_1': event['location_street_1'],
                'location_street_2': event['location_street_2'],
                'location_state': event['location_state'],
                'location_zip': event['location_zip'],
                'recurring': event['recurring'],
                'recurring_increment': event['recurring_increment'],
                'recurring_time_end_date': event['recurring_time_end_date'],
                'recurring_time_end_time': event['recurring_time_end_time'],
                'registration_url': event['registration_url'],
                'time_end_date': event['time_end_date'],
                'time_end_time': event['time_end_time'],
                'time_start_date': event['time_start_date'],
                'time_start_time': event['time_start_time'],
                'metadata': metadata if metadata is not None else {},
            }
        )
        return eventid

    def get_item(self, eventid, username=DEFAULT_USERNAME):
        response = self._table.get_item(
            Key={
                'userID': username,
                'eventID': eventid,
            },
        )
        return response['Item']

    def delete_item(self, eventid, username=DEFAULT_USERNAME):
        self._table.delete_item(
            Key={
                'userID': username,
                'eventID': eventid,
            }
        )

    def update_item(self, eventid, event=None, status=None,
                    metadata=None, username=DEFAULT_USERNAME):
        # We could also use update_item() with an UpdateExpression.
        item = self.get_item(eventid, username)
        if status is not None:
            item['event_status'] = status
        if metadata is not None:
            item['metadata'] = metadata
        self._table.put_item(Item=item)
