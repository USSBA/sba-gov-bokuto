
const AWS = require('aws-sdk');

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SESSIONS_TABLE } = process.env;

AWS.config.update({
	region: AWS_REGION,
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY
})

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = {
    requireAuth(req, res, next) {
        if (!req.session.tokenId) {
            return res.redirect('/login')
        } else {
            console.log("Session found!")
            // Verify that it's still an active JWT
            const params = {
                TableName: SESSIONS_TABLE,
                Key: {
                    tokenID: req.session.tokenId,
                }
            };
            
            dynamoDb.get(params, function(error, data) {
                if (error) {
                    console.error('Unable to get. Error:', JSON.stringify(error, null, 2));
                } else {
                    console.log(`Get succeeded: ${data.Item.tokenID}`);
                }
            });

            res.locals.token = req.session.tokenId;
        }

        next()
    }
}