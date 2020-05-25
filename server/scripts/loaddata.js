const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing to do lists into DynamoDB.  Please wait.");

var allEvents = JSON.parse(fs.readFileSync("eventdata.json", "utf8"));
allEvents.forEach(function(event) {
  var params = {
    TableName: "Events",
    Item: {
      eventID: event.customerID,
      title: event.title,
      description: event.description,
      office: event.office,
      start_time: event.start_time,
      end_time: event.end_time,
      type: event.type,
      recurring: event.recurring,
      location_name: event.location_name,
      address_street_1: event.address_street_1,
      address_street_2: event.address_street_2,
      address_city: event.address_city,
      address_state: event.address_state,
      address_zip: event.address_zip,
      contact_name: event.contact_name,
      contact_email: event.contact_email,
      contact_phone: event.contact_phone,
      registration_url: event.registration_url,
      cost: event.cost
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.error(
        "unable to add todo",
        event.eventID,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", event.eventID);
    }
  });
});