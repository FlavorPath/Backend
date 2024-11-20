const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = process.env.PORT
dotenv.config();

const app = express();

app.listen(PORT, () => {
    console.log(`Server is running on port 7777`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Middleware
app.use(cors());
app.use(express.json());


module.exports = app;
