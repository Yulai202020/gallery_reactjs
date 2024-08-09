const vars = require("./vars");
const Cookie = require("js-cookie");
var token = vars.get_token();
console.log(token)

test('POST API Tests', async () => {
    Cookie.set("token", token, { expires: 1/24 });

    const response = await fetch('http://localhost:8000/api/images', {
        method: 'GET',
        headers: {
            Cookie: `token=${token}`
        },
        credentials: 'include',
    });

    // expect(response.status).toBe(200);

    const data = await response.json();
    console.log(data);
});

