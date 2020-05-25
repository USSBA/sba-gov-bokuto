# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# copy package.json into the container
COPY package.json /app

# copy source code into container
COPY src/. /app/src

# install dependencies
RUN npm install

# copy scripts over
COPY scripts/. /app/scripts

# create table and load data
RUN npm run setup
RUN npm run add

# expose port
EXPOSE 3000

# run node process
CMD ["npm", "start"]