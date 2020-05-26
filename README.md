# Bokuto
Bokuto is a self-contained Express microservice for end users to create, review, approve, and publish events through. It is designed to feed the Shinai lambda.  A [bokuto](https://en.wikipedia.org/wiki/Bokken) is a wooden practice sword that was the precursor to the bamboo shinai.  

## Development
Before getting started, make sure you have docker and docker-compose installed.  

Start a local version of DynamoDB using docker:
`docker run -p 8000:8000 amazon/dynamodb-local`

Use the server/scripts folder to create your table:
`node createtable.js`

Several other scripts are provided to load or return data:
`node loaddata.js`

Once you have a local DynamoDB running, you can run app.js with nodemon for best experience:

`npx nodemon server/src/app.js`

You can interact with the development site at: `http://localhost:3000/`

## To Do
To complete this service, following needs to be implemented:

- Approval view
- Secondary indexes in DDB for event ownership and event status
- Login/Authentication middleware
- Roles/responsibilities logic to display only events you own (or your district owns)