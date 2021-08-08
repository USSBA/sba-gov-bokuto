from urllib import request, parse
import json
import base64

url = 'https://auth.ussba.io/oauth2/token'

data = {
    "grant_type": "authorization_code",
    "code": "",
    "client_id": "",
    "redirect_uri": "https://eventadmin.ussba.io/api/login"
    # "scope": "openid+email"
    # 'code_verifier': '' - optional, only required if a code_challenge was specified in the original request)
}

client_id = ""
client_secret = ""
client_id_plus_secret = client_id + ":" + client_secret
client_auth_bytes = client_id_plus_secret.encode()
client_auth_base64 = base64.b64encode(client_auth_bytes)


client_secret_bytes = client_secret.encode()
client_secret_base64 = base64.b64encode(client_secret_bytes)
# data = json.dumps(data)
data = parse.urlencode(data).encode()

headers = {
    'Authorization': 'Basic ' + client_auth_base64.decode("utf-8"),
    'Content-Type': 'application/x-www-form-urlencoded',
}

req = request.Request(url, headers=headers, method="POST")
print(req.get_method() + " " + req.get_full_url())
print(req.header_items())
print(data)

try:
    resp = request.urlopen(req, data=data)
    # print(str(resp.content))
    tokens = resp.read().decode()
    tokens_json = json.loads(tokens)
    print(tokens_json['id_token'])
except Exception as e:
    print(e.read().decode())

