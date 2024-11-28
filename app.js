const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/user.routes");
const homeRoutes = require("./routes/home.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const searchRoutes = require("./routes/search.routes");
const scrapRouter = require("./routes/scrap.routes");
const reviewRoutes = require("./routes/review.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");

dotenv.config();

const app = express();

// Swagger UI 설정
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("Swagger UI available at http://localhost:1234/api-docs");

// CORS 설정
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:5173", "http://43.202.172.0:1234, http://localhost:1234"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS: ", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser 설정
app.use(bodyParser.json());

// API 라우트
app.use("/api/user", userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/scrap", scrapRouter);
app.use("/api/user/review", reviewRoutes);

// React 정적 파일 서빙
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

module.exports = app;
