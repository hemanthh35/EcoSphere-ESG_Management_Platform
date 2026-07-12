import urllib.request, json
import urllib.error

data = json.dumps({
    'email': 'test123456@example.com', 
    'password': 'Password123!', 
    'full_name': 'Test User', 
    'confirm_password': 'Password123!'
}).encode('utf-8')

req = urllib.request.Request(
    'http://localhost:8000/auth/register', 
    data=data, 
    headers={'Content-Type': 'application/json'}, 
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode())
except Exception as e:
    print("ERROR:", e)
