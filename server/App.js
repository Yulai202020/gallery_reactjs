const express = require("express");
const path = require('path');
const fs = require('fs');
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 8000;

app.listen(PORT, () => console.log("Server started."));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

app.get("/api/images", (req, res) => {
    res.sendFile(path.join(__dirname, 'images.json'));
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Example authentication logic (replace with your actual logic)
    if (username === "user" && password === "pass") {
        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});
  

app.post("/api/add", (req, res) => {
    var {link, alt, width, height} = req.body;
    var path_json = "./images.json"

    fs.readFile(path_json, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
    
        // Step 2: Parse the JSON content
        let jsonData;
        try {
            jsonData = JSON.parse(data);
            if (!Array.isArray(jsonData)) {
                throw new Error('JSON data is not an array');
            }
        } catch (parseErr) {
            console.error('Error parsing JSON or JSON is not an array:', parseErr);
            return;
        }
    
        // Step 3: Edit the JSON content
        // Example: Adding a new element to the array
        jsonData.push({"link": link, "alt": alt, "width": Number(width), "height": Number(height)});
    
        // Step 4: Write the updated JSON back to the file
        fs.writeFile(path_json, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing the file:', writeErr);
                return;
            }
    
            console.log('File successfully updated!');
        });
    });

    res.sendFile(path.join(__dirname, 'images.json'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});  