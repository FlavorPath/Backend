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
const path = require("path");
dotenv.config();

const app = express();

// Swagger UI 라우트 추가
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("Swagger UI available at http://localhost:1234/api-docs");

// CORS 설정
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:1234"];
    console.log("Origin: ", origin);
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


// 1. dist 폴더를 정적 파일로 제공
app.use(express.static(path.join(__dirname, "dist")));

// 2. React 라우터를 위해 모든 요청을 index.html로 리디렉션
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/scrap", scrapRouter);
app.use("/api/user/review", reviewRoutes);

module.exports = app;
