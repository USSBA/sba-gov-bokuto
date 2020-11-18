# Bokuto
Bokuto is a self-contained Express microservice for end users to create, review, approve, and publish events
through. It is designed to feed the Shinai lambda.  A [bokuto](https://en.wikipedia.org/wiki/Bokken) is a wooden
practice sword that was the precursor to the bamboo shinai.

## Development

### Setup

Before getting started, make sure you have docker and docker-compose installed.
Also, make sure you have AWS credentials configured.

If using an AWS profile make sure that the executing shell has the `AWS_PROFILE` environment variable set
and make sure that the `docker-compose.yml` includes the following settings.
```
# docker-compose.yml

# In the environment block of the bokuto service include the following:

  environment:
  - AWS_PROFILE=${AWS_PROFILE}

# In the volumes block of the bokuto service include the following:

  volumes:
  - ~/.aws/:/root/.aws/:ro

```

If using an AWS AccessKey make sure that the executing shell has the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
and `AWS_DEFAULT_REGION` environment variables exported.

```
# docker-compose.yml

# In the environment block of the bokuto service include the following:

  environment:
  - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
  - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
  - AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}

```

### Building and Running with Docker

Once the docker-compose.yml and your local shell are configured we can proceed to
building and running the docker container for testing your code changes.

```

# build and run the container
docker-compose build
docker-compose up


# test
curl -I http://localhost:3000/healthcheck

```

# Ryan you will need to adjust or remove the following

Start a local version of DynamoDB using docker:
`docker run -p 8000:8000 amazon/dynamodb-local`

Use the server/scripts folder to create your table:
`node createtable.js`

Several other scripts are provided to load or return data:
`node loaddata.js`

Once you have a local DynamoDB running, you can run app.js with nodemon for best experience:

`npx nodemon server/src/app.js`

You can interact with the development site at: `http://localhost:3000/`

## Dev Environment (Remote)
How to launch a dev environment using EC2
- Launch new EC2 Instance with Ubuntu Server
- Run `apt get update` and `apt get upgrade` to bring you current
- Install Node
`curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -`
`sudo apt-get install -y nodejs`
- Install node modules
`npm install`
- Install PM2 globally
`npm install pm2@latest -g`
- Run PM2 with your app
`pm2 start src/app.js`

## To Do
To complete this service, following needs to be implemented:

- Find different process manager
- Operationalize dev environment better
