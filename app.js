const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/users', userRoutes);

module.exports = app;
