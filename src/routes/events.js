const AWS 				= require('aws-sdk');
var express = require("express")
var router = express.Router()

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, EVENTS_TABLE } = process.env;

AWS.config.update({
	region: AWS_REGION,
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY
})

const dynamoDb = new AWS.DynamoDB.DocumentClient();

var { requireAuth } = require("./middlewares")

// GET: List all events
router.get('/events', requireAuth, function(request, response) {
	console.log('GET: Events listview route accessed');

	const params = {
		TableName: EVENTS_TABLE
	};

	console.log(params.TableName)

	dynamoDb.scan(params, (error, result) => {
		if (error) {
			console.error('Unable to scan the table. Error JSON:', JSON.stringify(error, null, 2));
			response.status(400).json({ error: 'Error retrieving Events' });
		} else {
			console.log('Scan succeeded:');
			events = [];

			result.Items.forEach(function(event) {
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
	});
});

// POST: Create a new event
router.post('/events', requireAuth, function(request, response) {
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

	console.log("Recurring: " + recurring)
	console.log("Interval: " + recurring_interval)
	console.log("Recurrence End Date: " + recurring_end_date)

	var params = {
		TableName: EVENTS_TABLE,
		Item: {
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

	dynamoDb.put(params, function(error, data) {
		if (error) {
			console.error('Unable to add item. Error JSON:', JSON.stringify(error, null, 2));
		} else {
			console.log('added item:', JSON.stringify(data, null, 2));
		}
	});

	response.redirect('/events');
});

// GET: Form to create a new event
router.get('/events/new', requireAuth, function(request, response) {
	console.log('GET: Events new route accessed');
	response.render('new');
});

// GET: Form to edit a single event
router.get('/events/:id/edit', requireAuth, function(request, response) {
	console.log('GET: Show the form to edit a single event');
	var params = {
		TableName: EVENTS_TABLE,
		Key: {
			eventID: request.params.id,
		}
	};

	dynamoDb.get(params, function(error, data) {
		if (error) {
			console.error('Unable to get. Error:', JSON.stringify(error, null, 2));
		} else {
			console.log(`Get succeeded: ${data.Item.eventID}`);
			console.log(JSON.stringify(data.Item));
			response.render('edit', { event: data.Item });
		}
	});
});

// PUT: Update a single event
router.put('/events/:id', requireAuth, function(request, response) {
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
		address_street_1 = "";
		address_street_2 = ""
		address_city = ""
		address_state = ""
		address_zip = ""
	}

	if (recurring = "onetime") {
		recurring_interval = ""
		recurring_end_date = ""
	}

	var params = {
		TableName: EVENTS_TABLE,
		Key: {
			eventID: request.params.id
		},
		UpdateExpression:
			'set title = :t, description = :des, office = :off, start_date = :sd, end_date = :ed, start_time = :st, end_time = :et, event_timezone = :tz, event_type = :ty, recurring = :r, recurring_interval = :ri, recurring_end_date = :red, location_name = :ln, address_street_1 = :as1, address_street_2 = :as2, address_city = :ac, address_state = :as, address_zip = :azip, contact_name = :cn, contact_email = :ce, contact_phone = :cp, registration_url = :url, cost = :cost, eventStatus = :status',
		ExpressionAttributeValues: {
			':t'     : title,
			':des'   : description,
            ':off'   : office,
            ':sd'    : start_date,
            ':ed'    : end_date,
            ':st'    : start_time,
            ':et'    : end_time,
            ':tz'    : timezone,
            ':ty'    : event_type,
			':r'     : recurring,
			':ri'    : recurring_interval,
			':red'   : recurring_end_date,
            ':ln'    : location_name,
            ':as1'   : address_street_1,
            ':as2'   : address_street_2,
            ':ac'    : address_city,
            ':as'    : address_state,
            ':azip'  : address_zip,
            ':cn'    : contact_name,
            ':ce'    : contact_email,
            ':cp'    : contact_phone,
            ':url'   : registration_url,
            ':cost'  : cost,
            ':status': request.query.status
		},
		ReturnValues: 'UPDATED_NEW'
	};

	dynamoDb.update(params, function(error, data) {
		if (error) {
			console.error('Unable to update item.  Error JSON:', JSON.stringify(error, null, 2));
		} else {
			console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
		}
    });
    
    response.redirect('/events')
});

// DELETE: Delete a single event
router.delete('/events/:id', requireAuth, function(request, response) {
	console.log('DELETE: Remove a single event');
	const { id } = request.params;
	console.log(id);
	var params = {
		TableName: EVENTS_TABLE,
		Key: {
			eventID: id
		}
	};

	dynamoDb.delete(params, function(error, data) {
		if (error) {
			console.error('Unable to delete item. Erron JSON:', JSON.stringify(error, null, 2));
		} else {
			console.log('DeleteItem succeeded:', JSON.stringify(data, null, 2));
		}
	});

	response.redirect('/events');
});

// GET: List all events and their approval status
router.get('/events/approve', requireAuth, function(request, response) {
	console.log('GET: Approval listview route accessed');
	// var params = {
	// 	TableName: EVENTS_TABLE,
	// 	KeyConditionExpress:
	// }
    response.render('approve')

    // TO BE IMPLEMENTED
	// const params = {
    //     TableName: EVENTS_TABLE,
    //     KeyConditionExpression: "event_status = :status",
    //     ExpressionAttributeNames:{
    //         "event_status": "event_status"
    //     },
    //     ExpressionAttributeValues: {
    //         ":status": "submitted"
    //     }
	// };

	// dynamoDb.query(params, (error, result) => {
	// 	if (error) {
	// 		console.error('Unable to scan the table. Error JSON:', JSON.stringify(error, null, 2));
	// 		response.status(400).json({ error: 'Error retrieving Events' });
	// 	} else {
	// 		console.log('Scan succeeded:');
	// 		events = [];

	// 		result.Items.forEach(function(event) {
	// 			var output = {
	// 				id: event.eventID,
	// 				title: event.title,
    //                 office: event.office,
    //                 start_date: event.start_date,
	// 				start_time: event.start_time,
	// 				status: event.event_status
	// 			};
	// 			events.push(output);
	// 		});

	// 		response.render('approve', { events: events });
	// 	}
	// });
});

module.exports = router