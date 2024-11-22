const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const homeRoutes = require("./routes/home.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const searchRoutes = require("./routes/search.routes");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/user", userRoutes);
app.use("/home/markers", homeRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/search", searchRoutes);

module.exports = app;
