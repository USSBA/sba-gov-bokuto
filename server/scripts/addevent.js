var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Events";
var eventID = 1;

var params = {
  TableName: table,
  Item: {
    eventID: eventID,
    title: "Business Plan Writing 101",
    description: "Come learn how to write a business plan",
    office: "Dallas/Fort Worth",
    start_time: "20200525T094419Z",
    end_time: "20200525T094419Z",
    type: "in-person",
    recurring: false,
    location_name: "Small Business Development Center",
    address_street_1: "500 Main Street",
    address_street_2: "Suite 20",
    address_city: "Fort Worth",
    address_state: "TX",
    address_zip: "75621",
    contact_name: "Bob Underwood",
    contact_email: "bob@underwood.com",
    contact_phone: "817-555-9151",
    registration_url: "https://smallbiztx.com/write-a-business-plan.html",
    cost: "$5"
  }
};

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
  if (err) {
    console.error(
      "Unable to add item. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log("Added item:", JSON.stringify(data, null, 2));
  }
});