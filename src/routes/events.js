const AWS = require('aws-sdk');
var express = require("express");
const https = require('https');
const uuid = require('uuid');
var router = express.Router()

const { EVENTS_TABLE, SHINAI_URL, SHINAI_KEY } = process.env;

const dynamoDb = new AWS.DynamoDB.DocumentClient();

var { requireAuth } = require("./middlewares");
const { on } = require('process');

// GET: List all events
router.get('/events', requireAuth, function (request, response) {
  console.log('GET: Events listview route accessed');

  // All events that a user owns (userID in DynamoDB)
  const params = {
    TableName: EVENTS_TABLE,
    KeyConditionExpression: 'userID = :uid',
    ExpressionAttributeValues: {
      ':uid': request.session.userId
    },
  };

  dynamoDb.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query.  Error:", JSON.stringify(err, null, 2))
    } else {
      console.log("Query succeeded.")
      // turn this into a map
      events = []
      data.Items.forEach(function (event) {
        var output = {
          id: event.eventID,
          title: event.title,
          office: event.office,
          start_date: event.start_date,
          start_time: event.start_time,
          status: event.eventStatus
        };
        events.push(output);
      });
      response.render('show', { events: events });
    }
  })
});

// POST: Create a new event
router.post('/events', requireAuth, function (request, response) {
  console.log('POST: Create new event route accessed');
  console.log(request.query.status)
  console.log(request.body.event)
  var {
    title,
    description,
    office,
    start_date,
    end_date,
    start_time,
    end_time,
    timezone,
    event_type,
    recurring,
    recurring_interval,
    recurring_end_date,
    location_name,
    address_street_1,
    address_street_2,
    address_city,
    address_state,
    address_zip,
    contact_name,
    contact_email,
    contact_phone,
    registration_url,
    cost
  } = request.body.event;
  // TO-DO Refinements:
  // add userID, eventID, and status to the body.event object
  // pass the actual body.event object as Item
  var params = {
    TableName: EVENTS_TABLE,
    Item: {
      // add some sugar (remove duplicates for same name attributes)
      userID: request.session.userId,
      eventID: uuid.v4(),
      title: title,
      description: description,
      office: office,
      start_date: start_date,
      end_date: end_date,
      start_time: start_time,
      end_time: end_time,
      timezone: timezone,
      event_type: event_type,
      recurring: recurring,
      recurring_interval: recurring_interval,
      recurring_end_date: recurring_end_date,
      location_name: location_name,
      address_street_1: address_street_1,
      address_street_2: address_street_2,
      address_city: address_city,
      address_state: address_state,
      address_zip: address_zip,
      contact_name: contact_name,
      contact_email: contact_email,
      contact_phone: contact_phone,
      registration_url: registration_url,
      cost: cost,
      eventStatus: request.query.status
    }
  };

  dynamoDb.put(params, function (error, data) {
    if (error) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(error, null, 2));
    } else {
      console.log('added item:', JSON.stringify(data, null, 2));
    }
  });

  response.redirect('/events');
});

// GET: Form to create a new event
router.get('/events/new', requireAuth, function (request, response) {
  console.log('GET: Events new route accessed');
  response.render('new');
});

// GET: Form to edit a single event
router.get('/events/:id/edit', requireAuth, function (request, response) {
  console.log('GET: Show the form to edit a single event');

  // Event that a user owns (userID in DDB) with a particular id (eventID in DDB)
  var params = {
    TableName: EVENTS_TABLE,
    Key: {
      userID: request.session.userId,
      eventID: request.params.id,
    }
  };

  dynamoDb.get(params, function (error, data) {
    if (error) {
      console.error('Unable to get. Error:', JSON.stringify(error, null, 2));
    } else {
      console.log(`Get succeeded: ${data.Item.eventID}`);
      console.log(JSON.stringify(data.Item));
      response.render('edit', { event: data.Item });
    }
  });
});

// GET: Form to review a single event
router.get('/events/:id/review', requireAuth, function (request, response) {
  console.log('GET: Show the form to edit a single event');

  // Event that a user owns (userID in DDB) with a particular id (eventID in DDB)
  var params = {
    TableName: EVENTS_TABLE,
    Key: {
      userID: request.session.userId,
      eventID: request.params.id,
    }
  };

  dynamoDb.get(params, function (error, data) {
    if (error) {
      console.error('Unable to get. Error:', JSON.stringify(error, null, 2));
    } else {
      console.log(`Get succeeded: ${data.Item.eventID}`);
      console.log(JSON.stringify(data.Item));
      response.render('review', { event: data.Item });
    }
  });
});

// PUT: Update a single event
router.put('/events/:id', requireAuth, function (request, response) {
  console.log('PUT: Update a single event');
  console.log(request.query.status)
  var {
    title,
    description,
    office,
    start_date,
    end_date,
    start_time,
    end_time,
    timezone,
    event_type,
    recurring,
    recurring_interval,
    recurring_end_date,
    location_name,
    address_street_1,
    address_street_2,
    address_city,
    address_state,
    address_zip,
    contact_name,
    contact_email,
    contact_phone,
    registration_url,
    cost
  } = request.body.event;

  if (event_type == "online") {
    address_street_1 = ""
    address_street_2 = ""
    address_city = ""
    address_state = ""
    address_zip = ""
  }

  if (recurring == "onetime") {
    recurring_interval = ""
    recurring_end_date = ""
  }

  // Event that a user owns (userID in DDB) with a particular id (eventID in DDB)
  var params = {
    TableName: EVENTS_TABLE,
    Key: {
      userID: request.session.userId,
      eventID: request.params.id
    },
    // create
    UpdateExpression: 'set title = :t, description = :des, office = :off, start_date = :sd, end_date = :ed, start_time = :st, end_time = :et, event_timezone = :tz, event_type = :ty, recurring = :r, recurring_interval = :ri, recurring_end_date = :red, location_name = :ln, address_street_1 = :as1, address_street_2 = :as2, address_city = :ac, address_state = :as, address_zip = :azip, contact_name = :cn, contact_email = :ce, contact_phone = :cp, registration_url = :url, cost = :cost, eventStatus = :status',
    ExpressionAttributeValues: {
      ':t': title,
      ':des': description,
      ':off': office,
      ':sd': start_date,
      ':ed': end_date,
      ':st': start_time,
      ':et': end_time,
      ':tz': timezone,
      ':ty': event_type,
      ':r': recurring,
      ':ri': recurring_interval,
      ':red': recurring_end_date,
      ':ln': location_name,
      ':as1': address_street_1,
      ':as2': address_street_2,
      ':ac': address_city,
      ':as': address_state,
      ':azip': address_zip,
      ':cn': contact_name,
      ':ce': contact_email,
      ':cp': contact_phone,
      ':url': registration_url,
      ':cost': cost,
      ':status': request.query.status
    },
    ReturnValues: 'UPDATED_NEW'
  };

  dynamoDb.update(params, function (error, data) {
    if (error) {
      console.error('Unable to update item.  Error JSON:', JSON.stringify(error, null, 2));
    } else {
      console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
      // if event.status == approved then posting to Shinai
      // fetch to endpoint
    }
  });

  response.redirect('/events')
});

// DELETE: Delete a single event
router.delete('/events/:id', requireAuth, function (request, response) {
  console.log('DELETE: Remove a single event');
  const { id } = request.params;
  console.log(id);

  // Event that a user owns (userID in DDB) with a particular id (eventID in DDB)
  var params = {
    TableName: EVENTS_TABLE,
    Key: {
      eventID: id,
      userID: request.session.userId,
    }
  };

  dynamoDb.delete(params, function (error, data) {
    if (error) {
      console.error('Unable to delete item. Erron JSON:', JSON.stringify(error, null, 2));
    } else {
      console.log('DeleteItem succeeded:', JSON.stringify(data, null, 2));
    }
  });

  response.redirect('/events');
});

// GET: List all events and their approval status
router.get('/events/approve', requireAuth, function (request, response) {
  console.log('GET: Approval listview route accessed');

  // List of events belonging to the userOffice with a status of "submitted"
  const params = {
    TableName: EVENTS_TABLE,
    ProjectionExpress: "eventID, title, office, start_date, start_time, eventStatus",
    IndexName: 'office-eventStatus-index',
    KeyConditionExpression: 'office = :off and eventStatus = :evs',
    ExpressionAttributeValues: {
      ':off': request.session.userOffice,
      ':evs': "submitted"
    },
  };

  console.log(params)
  dynamoDb.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query.  Error:", JSON.stringify(err, null, 2))
    } else {
      console.log("Query succeeded.")
      events = []
      data.Items.forEach(function (event) {
        var output = {
          id: event.eventID,
          title: event.title,
          office: event.office,
          start_date: event.start_date,
          start_time: event.start_time,
          status: event.eventStatus
        };
        events.push(output);
      });
      console.log(events)
      response.render('approve', { events: events });
    }
  })
});

// GET: Approve an individual event
router.get('/events/:id/approve', requireAuth, function (request, response) {
  console.log('GET: Approval for single event received');
  var params = {
    TableName: EVENTS_TABLE,
    Key: {
      userID: request.session.userId,
      eventID: request.params.id,
    }
  };

  dynamoDb.get(params, function (error, data) {
    if (error) {
      console.error('Unable to get. Error:', JSON.stringify(error, null, 2));
    } else {
      console.log(`Get succeeded: ${data.Item.eventID}`);
      console.log(JSON.stringify(data.Item));
      // const eventData = JSON.stringify(data.Item);

      // Send the request to Shinai
      // Standard HTTP module
      let eventData = JSON.stringify({
        "d": {
          "__metadata": {
            "id": "ebe2d550-58f1-4f54-a632-b067e7384365",
            "uri": "https://spteamfearless.sharepoint.com/sites/SBAEvents/_api/Web/Lists(guid'62accc8a-ae0e-43d7-a1cf-27a8cb78558a')/Items(304)",
            "etag": "\"2\"",
            "type": "SP.Data.EventsListListItem"
          },
          "Id": data.Item.eventID,
          "Title": data.Item.title,
          "Description": data.Item.description,
          "DistrictOffice": data.Item.office,
          "StartDate": data.Item.start_date,
          "EndDate": data.Item.end_date,
          "TimeZone": "",
          "RecurringEvent": data.Item.recurring,
          "RecurrenceEndDate": "2020-05-24T04:00:00Z",
          "RecurringEventCycle": data.Item.recurring_interval,
          "LocationName": data.Item.location_name,
          "Street": "4404 Amon Carter Blvd",
          "Additional": "#102",
          "City": "Fort Worth",
          "Postalcode": "76155",
          "State": "Texas",
          "Country": "",
          "ContactName": data.Item.contact_name,
          "Email": data.Item.contact_email,
          "Phone": data.Item.contact_phone,
          "Extension": "",
          "RegistrationLink": data.Item.registration_url,
          "Status": data.Item.eventStatus,
          "Cost": data.Item.cost,
          "LocationType": data.Item.event_type,
          "OfficeId": "6386",
          "ApproverComments": "",
          "EventType": "Parent",
          "ParentID": "",
          "StartTime": data.Item.start_time,
          "EndTime": data.Item.end_time,
          "ID": data.Item.eventID,
        }
      })

      const options = {
        hostname: SHINAI_URL,
        path: '/events',
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
          'Content-Length': eventData.length,
          'x-api-key': SHINAI_KEY,
        }
      }

      https.request(options, eventResponse => {
        let responseData = ""
        eventResponse.on("data", d => {
          responseData += d
        })
        eventResponse.on("end", () => {
          console.log(eventData)
        })
      })
        .on("error", console.error)
        .end(eventData)

      // Standard HTTPS module
      //   const options = {
      //   hostname: SHINAI_URL,
      //   port: 443,
      //   path: '/events',
      //   method: 'POST',
      //   headers: {
      //     'x-api-key': SHINAI_KEY,
      //     'Content-Length': eventData.length
      //   }
      //   }

      //   const transmit = https.request(options, (shinai_response) => {
      //   console.log(`statusCode: ${shinai_response.statusCode}`)

      //   shinai_response.on('data', (d) => {
      //     process.stdout.write(d)
      //     console.log(d)
      //   })
      //   })
      //   console.log(transmit)

      //   transmit.on('error', (error) => {
      //   console.error(error)
      //   })

      //   transmit.write(eventData)
      //   transmit.end()
    }
  });

  response.redirect('/events/approve');
});

router.post('/events/approve')
module.exports = router
