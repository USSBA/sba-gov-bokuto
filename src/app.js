// Setup
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const express = require("express");
const methodOverride = require("method-override");
const moment = require("moment");
const uuid = require("uuid");

// Instantiate Express
const app = express();

// Middleware
const { requireAuth } = require("./routes/middlewares");

// Environment Variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { EVENTS_TABLE, SESSION_SECRET, EXTERNAL_SESSION_SECRET } = process.env;

// Configure Express
//app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  cookieSession({
    keys: [SESSION_SECRET],
  })
);

// Routes
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/events");

app.use(authRouter);
app.use(eventRouter);

// app.use(function(req, res, next) {
//   res.locals.user = req.session.userId;
//   next();
// });

app.set("view engine", "ejs");

// Connect to Database
const dynamoDb = new AWS.DynamoDB.DocumentClient();

console.log(process.env.EVENTS_TABLE);
const params = {
  TableName: EVENTS_TABLE,
};

// Landing page with instructions
app.get("/", function (request, response) {
  console.log("GET: Root route accessed");
  // console.log(request.header('User-Agent'))
  // console.log(request.header('Access-Control-Allow-Origin'))
  // console.log(request.header('Access-Control-Allow-Credentials'))
  console.log(JSON.stringify(request.headers));
  console.log(JSON.stringify(request.body));
  console.log("Cookies: ", request.cookies);
  // console.log('eSessionCookiePlain: ', request.cookies['eSessionCookiePlain'])
  // console.log('lSessionCookiePlain: ', request.cookies['lSessionCookiePlain'])
  console.log("Signed Cookies: ", request.signedCookies);
  // console.log('eSessionCookie: ', cookieParser.signedCookie(request.signedCookies['eSessionCookie'], EXTERNAL_SESSION_SECRET))
  // console.log('lSessionCookie: ', cookieParser.signedCookie(request.signedCookies['lSessionCookie'], EXTERNAL_SESSION_SECRET))
  response.render("index");
});

app.get("/healthcheck", function (request, response) {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    response.send();
  } catch (error) {
    healthcheck.message = error;
    response.status(503).send();
  }
});

// Start Server
const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Bokuto slicing at http://localhost:${port}`)
);
