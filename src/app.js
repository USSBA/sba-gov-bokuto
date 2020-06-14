// Setup
const AWS 				= require('aws-sdk');
const bodyParser 		= require('body-parser');
const express 			= require('express');
const methodOverride 	= require('method-override');
const moment 			= require('moment');
// const passport          = require('passport');
// const passportLocal     = require('passport-local');
const uuid 				= require('uuid');

// Instantiate Express
const app = express();

// Configure Express
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(require("express-session")({
//     secret: "The Pen is Mightier Than the Sword",
//     resave: false,
//     saveUninitialized: false
// }))

app.set('view engine', 'ejs');

// Setup Passport
// app.use(passport.initialize())
// app.use(passport.session())

// passport.use(new LocalStrategy({
// 	username
// 	}
// ))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

// Environment variables
const { AWS_REGION, DDB_ENDPOINT, EVENTS_TABLE } = process.env;

// Connect to Database
// Development
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2', endpoint: 'http://localhost:8000' });
// Production
// const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: AWS_REGION, endpoint: DDB_ENDPOINT });

// ROUTES
// Landing page with instructions
app.get('/', function(request, response) {
	console.log('GET: Root route accessed');
	response.render('index');
});

// Login form
app.get("/login", function(req, res) {
    res.render("login")
})

// Handle user login
// Utilize middleware
// // <-- begin of route --- middleware --- end of route (handler) -->
// app.post("/login", passport.authenticate("local", {
//     successRedirect: "/secret",
//     failureRedirect: "/login"
// }),
// // end of route (handler)
//     function(req, res) {
// })

// Middleware to test if logged in
// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect("/login")
// }

// // Logout route
// app.get("/logout", function(req, res) {
//     req.logout()
//     res.redirect("/")
// })

// GET: List all events
app.get('/events', function(request, response) {
	console.log('GET: Events listview route accessed');

	const params = {
		TableName: 'Events'
	};

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
					status: event.event_status
				};
				events.push(output);
			});

			response.render('show', { events: events });
		}
	});
});

// POST: Create a new event
app.post('/events', function(request, response) {
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
		TableName: 'Events',
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
            event_status: request.query.status
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
app.get('/events/new', function(request, response) {
	console.log('GET: Events new route accessed');
	response.render('new');
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
app.put('/events/:id', function(request, response) {
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
		TableName: 'Events',
		Key: {
			eventID: request.params.id
		},
		UpdateExpression:
			'set title = :t, description = :des, office = :off, start_date = :sd, end_date = :ed, start_time = :st, end_time = :et, event_timezone = :tz, event_type = :ty, recurring = :r, recurring_interval = :ri, recurring_end_date = :red, location_name = :ln, address_street_1 = :as1, address_street_2 = :as2, address_city = :ac, address_state = :as, address_zip = :azip, contact_name = :cn, contact_email = :ce, contact_phone = :cp, registration_url = :url, cost = :cost, event_status = :status',
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
app.delete('/events/:id', function(request, response) {
	console.log('DELETE: Remove a single event');
	const { id } = request.params;
	console.log(id);
	var params = {
		TableName: 'Events',
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
app.get('/events/approve', function(request, response) {
    console.log('GET: Approval listview route accessed');
    response.render('approve')

    // TO BE IMPLEMENTED
	// const params = {
    //     TableName: 'Events',
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

// Start Server
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Bokuto listening at http://localhost:${port}`));
