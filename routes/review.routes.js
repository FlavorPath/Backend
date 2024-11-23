const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  getAllReviews,
  getReview,
  changeReview,
} = require("../controllers/review.controller");

// 유저가 작성한 모든 리뷰 불러오기
router.get("/", authMiddleware, getAllReviews);

// 기존 리뷰 불러오기
router.get("/:id", authMiddleware, getReview);

// 리뷰 수정하기
router.put("/:id", authMiddleware, changeReview);

module.exports = router;
