// imports
const cookieParser = require("cookie-parser");
const express = require("express");
const multer = require("multer");
var cors = require("cors")

const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// include prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// init app
const app = express();
const PORT = 8000;

// init needed vars
var photos_folder = "photos"
var encrypter = "ibutytuiu89r56tcyjhknklihg8fty"

// init cors optoin
var corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

// start server
app.listen(PORT, () => console.log("Server started."));

// apply extensions to app
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add storage for upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/api/removeall", async (req, res) => {
    const token = req.cookies.token;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    await prisma.images.deleteMany({ where: { username: username } })
    console.log("Deleted all images from user:")
    console.log(username);

    return res.status(200).json({ message: "OK" });
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
    const { subject, alt } = req.body;
    const token = req.cookies.token;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    if (!req.file) {
        return res.status(404).send("No file uploaded.");
    }

    const uploadPath = path.join(__dirname, photos_folder, username);

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    // get time and make new filename
    const filename = req.file.originalname;
    const now = new Date();

    const datePart = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timePart = now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0'); // HH:MM:SS.mmm

    const timestamp = `${datePart}-${timePart}`;

    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);

    // Generate the new filename
    const newFilename = `${basename}-${timestamp}${ext}`;

    // filepath
    const filePath = path.join(uploadPath, newFilename);

    // if file exists
    if (fs.existsSync(filePath)) {
        return res.status(402).json({ message: "File is already exists." })
    }

    try {
        await fs.promises.writeFile(filePath, req.file.buffer);
    } catch (err) {
        return res.status(500).json({ message: "Error saving the file." });
    }

    const response = await prisma.images.create({ data: { alt: alt, subject: subject, username: username, filename: newFilename } });
    console.log("Uploaded image:")
    console.log(response.id)

    return res.status(200).json({ id: response.id, message: "OK" });
});

app.get("/api/image/:id", async (req, res) => {
    // get username
    const token = req.cookies.token;
    const id = Number(req.params.id);
    var username;
    
    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    const response = await prisma.images.findFirst({ where: { id: id, username: username } })

    const filePath = path.join(__dirname, 'photos', username, response.filename);
    return res.status(200).sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            return res.status(500).send({ message: 'Error sending file' });
        }
    });
});

app.get("/api/images", async (req, res) => {
    const token = req.cookies.token;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    const response = await prisma.images.findMany({ where: { username: username } })
    console.log("Sended images:")
    console.log(response);

    return res.status(200).json(response);
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username: username }});

    if (response === null) {
        return res.status(404).json({ message: "Username not found" });
    }
    if (response.password !== password) {
        return res.status(403).json({ message: "Invalid password" });
    }

    console.log("Logined in user:");
    console.log(response)

    const token = jwt.sign({ username }, encrypter, { expiresIn: "1h" });
    return res.status(200).json({ token });
});

app.post("/api/remove", async (req, res) => {
    const { id } = req.body;
    const token = req.cookies.token;

    var username;
    var numId = Number(id);

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    const response = await prisma.images.findFirst({ where: { id: numId, username: username} });

    console.log("Removed image:");
    console.log(response)

    if (response !== null) {
        const deleteFile = path.join(photos_folder, username, response.filename);
    
        fs.unlink(deleteFile, (err) => {
            if (err) {
                console.error("Error deleting the file:", err);
                return res.status(500).send({ message: "Error deleting the file" });
            }
        });
    } else {
        return res.status(404).send({ message: "File not found." });
    }

    await prisma.images.delete({ where: { id: numId, username: username} });

    return res.status(200).json({ message: "OK" });
});

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username: username }});

    if (response === null) {
        const user = await prisma.user.create({ data: { username: username,  password: password }});
        const token = jwt.sign({ username }, encrypter, { expiresIn: "1h" });
        
        console.log("Created user:");
        console.log(user)

        const folder_path = path.join(photos_folder, username);
        fs.mkdirSync(folder_path, { recursive: true });
        
        return res.status(200).json({ token });
    } else {
        return res.status(403).json({ message: "User already exists" });
    }
});