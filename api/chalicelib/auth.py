import base64
import json
import os
import time
from urllib import request, parse
from jose import jwk, jwt
from jose.utils import base64url_decode

# Environment variables
app_client_id = os.environ['COGNITO_APP_CLIENT_ID']
app_client_secret = os.environ['COGNITO_APP_CLIENT_SECRET']
auth_url = os.environ['COGNITO_AUTH_URI']
redirect_url = os.environ['COGNITO_REDIRECT_URI']
region = os.environ['COGNITO_REGION']
userpool_id = os.environ['COGNITO_USER_POOL_ID']

# Derived values
login_url = f'{auth_url}/login?client_id={app_client_id}&response_type=code&scope=email+openid&redirect_uri={redirect_url}'
token_url = f'{auth_url}/oauth2/token'
keys_url = f'https://cognito-idp.{region}.amazonaws.com/{userpool_id}/.well-known/jwks.json'


# TO DO - does this code needs to move to app.py?
# instead of re-downloading the public keys every time
# we download them only on cold start
# https://aws.amazon.com/blogs/compute/container-reuse-in-lambda/
with request.urlopen(keys_url) as f:
    response = f.read()
keys = json.loads(response.decode('utf-8'))['keys']

# retrieve-token function calls the Cognito TOKEN endpoint and returns JWT tokens for user verification
# The custom application that’s hosted at the redirect URL can then extract the authorization code from the query parameters
# and exchange it for user pool tokens. The exchange occurs by submitting a POST request to https://AUTH_DOMAIN/oauth2/token
# with the following application/x-www-form-urlencoded parameters:
# > grant_type – Set to “authorization_code” for this grant.
# > code – The authorization code that’s vended to the user.
# > client_id – Same as from the request in step 1.
# > redirect_uri – Same as from the request in step 1.
# > code_verifier(optional, is required if a code_challenge was specified in the original request) – The base64 URL-encoded representation of the unhashed, random string that was used to generate the PKCE code_challenge in the original request.
# https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/
# https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html


def retrieve_token(code, type):
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": app_client_id,
        "redirect_uri": redirect_url
    }
    data = parse.urlencode(data).encode()

    app_client_auth_header = app_client_id + ":" + app_client_secret
    app_client_auth_header_base64 = base64.b64encode(
        app_client_auth_header.encode())
    headers = {
        'Authorization': 'Basic ' + app_client_auth_header_base64.decode("utf-8"),
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    req = request.Request(token_url, headers=headers, method="POST")

    try:
        resp = request.urlopen(req, data=data)

        # The JSON returned in the resulting response has the following keys:
        #  id_token – A valid user pool ID token. Note that an ID token is only provided if the openid scope was requested.
        #  access_token – A valid user pool access token.
        #  refresh_token – A valid user pool refresh token. This can be used to retrieve new tokens by sending it through a POST request to https: // AUTH_DOMAIN/oauth2/token, specifying the refresh_token and client_id parameters, and setting the grant_type parameter to “refresh_token“.
        #  expires_in – The length of time ( in seconds) that the provided ID and / or access token(s) are valid for.
        #  token_type – Set to “Bearer“.

        resp_decoded = resp.read().decode()
        tokens_json = json.loads(resp_decoded)
        id_token = tokens_json[type]
        return id_token
    except Exception as e:
        print(e.read().decode())

# https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.py


def verify_claims(event, context):
    token = event['token']
    # get the kid from the headers prior to verification
    headers = jwt.get_unverified_headers(token)
    kid = headers['kid']
    # search for the kid in the downloaded public keys
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]['kid']:
            key_index = i
            break
    if key_index == -1:
        print('Public key not found in jwks.json')
        return False
    # construct the public key
    public_key = jwk.construct(keys[key_index])
    # get the last two sections of the token,
    # message and signature (encoded in base64)
    message, encoded_signature = str(token).rsplit('.', 1)
    # decode the signature
    decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
    # verify the signature
    if not public_key.verify(message.encode("utf8"), decoded_signature):
        print('Signature verification failed')
        return False
    print('Signature successfully verified')
    # since we passed the verification, we can now safely
    # use the unverified claims
    claims = jwt.get_unverified_claims(token)
    # additionally we can verify the token expiration
    if time.time() > claims['exp']:
        print('Token is expired')
        return False
    # and the Audience  (use claims['client_id'] if verifying an access token)
    if claims['aud'] != app_client_id:
        print('Token was not issued for this audience')
        return False
    # now we can use the claims
    print(claims)
    return claims


# the following is useful to make this script executable in both
# AWS Lambda and any other local environments
if __name__ == '__main__':
    # for testing locally you can enter the JWT ID Token here
    event = {'token': ''}
    verify_claims(event, None)
