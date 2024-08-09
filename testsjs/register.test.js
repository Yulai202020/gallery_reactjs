test('POST API Tests', async () => {
    const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: 'test', password: "pass" })
    });

    // expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('token');
});
