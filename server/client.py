import requests, json

headers = {'Content-type': 'application/json'}
data = {"token": "your token"} # in /api/login or /api/register you can get it

response = requests.post('http://localhost:8000/api/images', json=data, headers=headers)

# Get the response
print(response)
print(response.headers)
