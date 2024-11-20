const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// const userRoutes = require('./routes/user.routes');
// const restaurantRoutes = require('./routes/restaurant.routes');
//
// app.use('/api/users', userRoutes);
// app.use('/api/restaurants', restaurantRoutes);

module.exports = app;
