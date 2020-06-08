zip -r ./bokuto.zip ./node_modules/ ./package.json ./package-lock.json index.js ./public ./routes ./views app.js
aws lambda update-function-code \
    --function-name  dev-BokutoLambda \
    --zip-file fileb://bokuto.zip