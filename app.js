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
  origin: "http://localhost:5173", // 프론트엔드의 정확한 도메인을 지정
  methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
  allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
  credentials: true, // 프론트엔드에서 쿠키, 인증 정보를 사용할 수 있도록 허용
};
app.use(cors(corsOptions));

// 정적 파일 제공
const buildPath = path.join(__dirname, "dist"); // React 빌드 폴더 경로
app.use(express.static(buildPath));

// React 애플리케이션의 라우트를 백엔드에서 처리
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});



app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/scrap", scrapRouter);
app.use("/api/user/review", reviewRoutes);

module.exports = app;
