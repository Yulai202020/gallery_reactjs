import requests, json

headers = {'Content-type': 'application/json'}
data = {"username": "test1", "password": "pass"} # in /api/login or /api/register you can get it
data = {'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNzIyNzczMzA1LCJleHAiOjE3MjI3NzY5MDV9.iXeJBVJ6VCdYA2Ioq82DSyYZ9l_Ur72B7JLpJtHhlQc'}
response = requests.post('http://localhost:8000/api/images', json=data, headers=headers)

# Get the response
print(response.json())
print(response.headers)
