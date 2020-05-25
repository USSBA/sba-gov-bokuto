const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var params = {
  TableName: "Events",
  KeySchema: [
    { AttributeName: "eventID", KeyType: "HASH" } //Partition key
  ],
  AttributeDefinitions: [{ AttributeName: "eventID", AttributeType: "N" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
};

dynamodb.createTable(params, function(err, data) {
  if (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Created table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});