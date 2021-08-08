# API

This application uses [AWS Chalice](https://aws.github.io/chalice/), a Python microframework for serverless applications.  To setup Chalice, you must have the AWS SDK, [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html) installed.  Once you have Boto3, follow the Chalice [Quickstart Guide](https://aws.github.io/chalice/quickstart.html) to get up and running.

# Development

## Environment Variables
You will need the following environment variables in your .chalce/config.json file:
```python
"environment_variables": {
    "COGNITO_APP_CLIENT_ID": "",
    "COGNITO_APP_CLIENT_SECRET": "",
    "COGNITO_AUTH_URI": "https://auth.ussba.io",
    "COGNITO_REDIRECT_URI": "https://eventadmin.ussba.io/api/login",
    "COGNITO_REGION": "us-east-1",
    "COGNITO_USER_POOL_ARN": "",
    "COGNITO_USER_POOL_ID": "",
    "COGNITO_USER_POOL_NAME": "EventAdmin",
    "DYNAMODB_EVENTS_TABLE_NAME": "eventadmin-events",
    "DYNAMODB_SESSIONS_TABLE_NAME": "eventadmin-sessions"
},
```