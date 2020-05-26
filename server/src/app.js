// Setup
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const express = require('express');
const uuid = require('uuid')

// Instantiate Express and Configure
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Environment variables
// const { EVENTS_TABLE, IS_OFFLINE } = process.env;
// const EVENTS_TABLE = 'Events';
// const { IS_OFFLINE } = process.env;

// Connect to Database
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2', endpoint: 'http://localhost:8000' });
// const dynamoDb =
// 	IS_OFFLINE === 'true'
// 		? new AWS.DynamoDB.DocumentClient({ region: 'us-west-2', endpoint: 'http://localhost:8000' })
// 		: new AWS.DynamoDB.DocumentClient();

// ROUTES
// Landing page with instructions
app.get('/', function(request, response) {
	console.log('GET: Root route accessed');
	response.render('index');
});

// GET: List all events
app.get('/events', function(request, response) {
	console.log('GET: Events listview route accessed');

	const params = {
		TableName: 'Events'
	};

	dynamoDb.scan(params, (error, result) => {
		if (error) {
			console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
			response.status(400).json({ error: 'Error retrieving Events' });
		} else {
			console.log('Scan succeeded:');
            events = [];
            
			result.Items.forEach(function(event) {
				var output = {
					id: event.eventID,
					title: event.title,
					office: event.office,
					start_time: event.start_time,
					end_time: event.end_time,
					status: event.status
				};
				console.log(output);
				events.push(output);
			});

			response.render('show', { events: events });
		}
	});
});

// GET: Form to create a new event
app.get('/events/new', function(request, response) {
	console.log('GET: Events new route accessed');
	response.render('new');
});

// POST: Create a new event
app.post('/events', function(request, response) {
	console.log('POST: Create new event route accessed');

    var { title, description, office, start_date, end_date, start_time, end_time, timezone, 
          type, recurring, location_name, address_street_1, address_street_2, address_city, 
          address_state, address_zip, contact_name, contact_email, contact_phone, registration_url, 
          cost } = request.body.event
    
    var params = {
		TableName: "Events",
		Item: {
            "eventID": uuid.v4(),
            "title": title,
            "description": description,
            "office": office,
            "start_date": start_date,
            "end_date": end_date,
            "start_time": start_time,
            "end_time": end_time,
            "timezone": timezone,
            "type": type,
            "recurring": recurring,
            "location_name": location_name,
            "address_street_1": address_street_1,
            "address_street_2": address_street_2,
            "address_city": address_city,
            "address_state": address_state,
            "address_zip": address_zip,
            "contact_name": contact_name,
            "contact_email": contact_email,
            "contact_phone": contact_phone,
            "registration_url": registration_url,
            "cost": cost
		}
    };

    dynamoDb.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("added item:", JSON.stringify(data, null, 2));
        }
    })

    response.redirect('/events')
});

// GET: Show a single event
app.get('/events/:id', function(request, response) {
	console.log('GET: Show a single event accessed');
});

// GET: Form to edit a single event
app.get('/events/:id/edit', function(request, response) {
	console.log('GET: Show the form to edit a single event');
	var params = {
		TableName: 'Events',
		Key: {
			eventID: request.params.id
		}
	};

	dynamoDb.get(params, function(err, data) {
		if (err) {
			console.error('Unable to get. Error:', JSON.stringify(err, null, 2));
		} else {
			console.log(`Get succeeded: ${data.Item.eventID}`);
			response.render('edit', { event: data.Item });
		}
	});
});

// PUT: Update a single event
app.put('/events/:id', function(request, response) {
	console.log('PUT: Update a single event');
});

// DELETE: Delete a single event
app.delete('/events/:id', function(request, response) {
	console.log('DELETE: Remove a single event');
});

// GET: List all events and their approval status
app.get('/events/approve', function(request, response) {
	console.log('GET: Approval listview route accessed');
	response.render('approve');
});

// Start Server
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Bokuto listening at http://localhost:${port}`));

// app.get('/events', (req, res) => {
// 	const params = {
// 		TableName: EVENTS_TABLE
// 	};

// 	dynamoDb.scan(params, (error, result) => {
// 		if (error) {
// 			res.status(400).json({ error: 'Error retrieving EVENTS' });
// 		}

// 		const { Items: todos } = result;

// 		res.json({ todos });
// 	});
// });

// app.get('/events/:eventId', (req, res) => {
// 	const { eventId } = req.params;

// 	const params = {
// 		TableName: EVENTS_TABLE,
// 		Key: {
// 			eventId
// 		}
// 	};

// 	dynamoDb.get(params, (error, result) => {
// 		if (error) {
// 			res.status(400).json({ error: 'Error retrieving Event' });
// 		}

// 		if (result.Item) {
// 			const { EventId, title, done } = result.Item;
// 			res.json({ todoId, title, done });
// 		} else {
// 			res.status(404).json({ error: `Todo with id: ${todoId} not found` });
// 		}
// 	});
// });

// app.post('/events', (req, res) => {
// 	const { title, done = false } = req.body;

// 	const todoId = uuid.v4();

// 	const params = {
// 		TableName: TODOS_TABLE,
// 		Item: {
// 			todoId,
// 			title,
// 			done
// 		}
// 	};

// 	dynamoDb.put(params, (error) => {
// 		if (error) {
// 			console.log('Error creating Todo: ', error);
// 			res.status(400).json({ error: 'Could not create Todo' });
// 		}

// 		res.json({ todoId, title, done });
// 	});
// });

// app.put('/todos', (req, res) => {
// 	const { todoId, title, done } = req.body;

// 	var params = {
// 		TableName: TODOS_TABLE,
// 		Key: { todoId },
// 		UpdateExpression: 'set #a = :title, #b = :done',
// 		ExpressionAttributeNames: { '#a': 'title', '#b': 'done' },
// 		ExpressionAttributeValues: { ':title': title, ':done': done }
// 	};

// 	dynamoDb.update(params, (error) => {
// 		if (error) {
// 			console.log(`Error updating Todo with id ${todoId}: `, error);
// 			res.status(400).json({ error: 'Could not update Todo' });
// 		}

// 		res.json({ todoId, title, done });
// 	});
// });

// app.delete('/todos/:todoId', (req, res) => {
// 	const { todoId } = req.params;

// 	const params = {
// 		TableName: TODOS_TABLE,
// 		Key: {
// 			todoId
// 		}
// 	};

// 	dynamoDb.delete(params, (error) => {
// 		if (error) {
// 			console.log(`Error updating Todo with id ${todoId}`, error);
// 			res.status(400).json({ error: 'Could not delete Todo' });
// 		}

// 		res.json({ success: true });
// 	});
// });

// Initialize Express
// const app = express();

// const { EVENTS_TABLE, IS_OFFLINE } = process.env;
