const fs = require('fs');

test('POST API Tests', async () => {
    const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: 'test', password: "pass" })
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('token');

    const jsonData = JSON.stringify(data, null, 4);
    const filePath = "token.json";

    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
    });
});
