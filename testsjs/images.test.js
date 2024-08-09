const vars = require("./vars");
const token = vars.get_token();

test('POST API Tests', async () => {
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000)); // 1 hour in milliseconds
    const expires = `expires=${expireDate.toUTCString()}`;

    const response = await fetch('http://localhost:8000/api/images', {
        method: 'GET',
        headers: {
            Cookie: `token=${token}`
        },
        credentials: 'include',
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    console.log(data);
});

