// Setup
const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

// ROUTES
// Landing page with instructions
app.get('/', function(request, response) {
    console.log("GET: Root route accessed")
    response.render('index')
})

// GET: List all events
app.get('/events', function(request, response) {
    console.log("GET: Events listview route accessed")
    response.render('show')
})

// GET: Form to create a new event
app.get('/events/new', function(request, response) {
    console.log("GET: Events new route accessed")
    response.render('new')
})

// POST: Create a new event
app.post('/events', function(request, response) {
    console.log("POST: Create new event route accessed")
})

// GET: Show a single event
app.get('/events/:id', function(request, response) {
    console.log("GET: Show a single event accessed")
})

// GET: Form to edit a single event
app.get('/events/:id/edit', function(request, response) {
    console.log("GET: Show the form to edit a single event")
})

// PUT: Update a single event
app.put('/events/:id', function(request, response) {
    console.log("PUT: Update a single event")
})

// DELETE: Delete a single event
app.delete('/events/:id', function(request, response) {
    console.log("DELETE: Remove a single event")
})

// GET: List all events and their approval
app.get('/events/approve', function(request, response) {
    console.log("GET: Approval listview route accessed")
    response.render('approve')
})

// Start Server
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// Connect to Database
// const dynamoDb =
// 	IS_OFFLINE === 'true'
// 		? new AWS.DynamoDB.DocumentClient({
// 				region: 'localhost',
// 				endpoint: 'http://localhost:8000'
// 			})
// 		: new AWS.DynamoDB.DocumentClient();

// app.use(bodyParser.json({ strict: false }));

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

