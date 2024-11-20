const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Example routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
