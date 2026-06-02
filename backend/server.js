require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const {connectMongo} = require('./mongo');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'ERA commerce API is running'});
});

async function startServer() {
    await connectMongo();
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();