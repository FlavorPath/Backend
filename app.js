const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const homeRoutes = require("./routes/home.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const searchRoutes = require("./routes/search.routes");
const cors = require('cors');

dotenv.config();

const app = express();

// CORS 설정
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use("/user", userRoutes);
app.use("/home/markers", homeRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/search", searchRoutes);

module.exports = app;
