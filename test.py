import unittest
import requests

class TestAPI(unittest.TestCase):
    BASE_URL = "http://0.0.0.0:8000"
    token = ""

    @classmethod
    def setUpClass(cls):
        # Log in and get the token once for all tests
        payload = {
            'username': 'test',
            'password': 'pass'
        }

        response = requests.post(f"{cls.BASE_URL}/api/login", json=payload)
        assert response.status_code == 200
        data = response.json()
        cls.token = data.get("token", "")

    def test_index_endpoint(self):
        if not self.token:
            self.skipTest("No token available. Skipping test.")
        
        cookies = {
            "token": self.token
        }

        response = requests.get(f"{self.BASE_URL}/api/images", cookies=cookies)
        print(f"Response: {response.json()}")
        self.assertEqual(response.status_code, 200)

    def test_uploading_endpoint(self):
        if not self.token:
            self.skipTest("No token available. Skipping test.")

        cookies = {
            "token": self.token
        }

        with open('file.txt', 'rb') as file:
            files = {'file': file}
            values = {
                'upload_file': 'file.txt',
                'DB': 'photcat',
                'OUT': 'csv',
                'SHORT': 'short',
                # needed for server
                "alt": "alt",
                "subject": "some subject"
            }

            response = requests.post(f"{self.BASE_URL}/api/upload", files=files, data=values, cookies=cookies)
            print(f"Response: {response.json()}")
            self.assertEqual(response.status_code, 200)

    # def test_remove_endpoint(self):
    #     cookies = {
    #         "token": self.token
    #     }

    #     response = requests.get(f"{self.BASE_URL}/api/removeall", cookies=cookies)
    #     print(f"Response: {response}")
    #     self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
