const express = require("express");
const router = express.Router();
const {
  getRestaurantDetail,
  getRestaurantReviews,
} = require("../controllers/restaurant.controller");

// 식상 상세 화면 API

// 식당 상세 조회
router.get("/:id", getRestaurantDetail);

// 식당 리뷰 조회
router.get("/:id/reviews", getRestaurantReviews);

// 식당 리뷰 작성
router.post("/:id/reviews");

// 식당 스크랩 추가/해제
router.post("/:id/scrap");

module.exports = router;
