const awsServerlessExpress = require('aws-serverless-express')
const app = require('./src/app')
const server = awsServerlessExpress.createServer(app)
exports.handler = function(event, context) {
  console.log(JSON.stringify(event))
  awsServerlessExpress.proxy(server, event, context)
}
