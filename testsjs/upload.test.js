const fs = require('fs');
const vars = require("./vars.js");

const filePath = 'file.txt';
const token = vars.get_token();

test('POST API Tests', async () => {
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000)); // 1 hour in milliseconds
    const expires = `expires=${expireDate.toUTCString()}`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
    
        const formData = new FormData();

        const blob = new Blob([data], { type: 'text/plain' }); // Change the MIME type as needed
        formData.append('file', blob, 'file.txt');
    
        fetch('http://localhost:8000/api/upload', {
            method: 'POST',
            headers: {
                Cookie: `token=${token}; ${expires}`
            },
            body: formData,
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    });
});
