var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Events";

var params = {
  TableName: table,
  KeyConditionExpression: "#off = :office",
  ExpressionAttributesNames:{
      "#off": "office"
  },
  ExpressionAttributesValues: {
      ":office": "Arizona"
  }
};

docClient.query(params, function(err, data) {
  if (err) {
    console.error(
      "Unable to read item. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log("Query succeeded:", JSON.stringify(data, null, 2));
  }
});