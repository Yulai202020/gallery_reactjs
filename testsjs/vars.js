const fs = require('fs');

function get_token() {
    var token = "";
    var filePath = "token.json";

    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            const data = JSON.parse(jsonData);
            token = data.token;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });

    return token;
};

module.exports = {get_token};