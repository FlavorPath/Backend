const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const homeRoutes = require("./routes/home.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const searchRoutes = require("./routes/search.routes");
const scrapRouter = require("./routes/scrap.routes");
const reviewRoutes = require("./routes/review.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger"); // Swagger 설정 파일
const cors = require("cors");

dotenv.config();

const app = express();

// Swagger UI 라우트 추가
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("Swagger UI available at http://localhost:1234/api-docs");

// CORS 설정
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
  allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use("/user", userRoutes);
app.use("/home", homeRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/search", searchRoutes);
app.use("/scrap", scrapRouter);
app.use("/user/review", reviewRoutes);

module.exports = app;
