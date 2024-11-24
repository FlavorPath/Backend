const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  getAllReviews,
  getReview,
  changeReview,
  deleteReview,
} = require("../controllers/review.controller");

/**
 * @swagger
 * /user/review:
 *   get:
 *     summary: 유저가 작성한 모든 리뷰 불러오기
 *     tags:
 *       - User Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *           default: 0
 *         description: 현재 페이지의 커서. 기본값은 0.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: 한 번에 가져올 데이터 수. 기본값은 5.
 *     responses:
 *       202:
 *         description: 작성된 리뷰 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 리뷰 ID
 *                       restaurant_id:
 *                         type: integer
 *                         description: 리뷰가 작성된 식당 ID
 *                       content:
 *                         type: string
 *                         description: 리뷰 내용
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: 리뷰 작성 날짜
 *                 lastCursor:
 *                   type: integer
 *                   description: 다음 요청에 사용할 커서
 *       404:
 *         description: 작성된 리뷰가 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 작성된 리뷰가 없습니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 서버 오류가 발생했습니다.
 */
// 유저가 작성한 모든 리뷰 불러오기
router.get("/", authMiddleware, getAllReviews);

// 기존 리뷰 불러오기
router.get("/:id", authMiddleware, getReview);

// 리뷰 수정하기
router.put("/:id", authMiddleware, changeReview);

// 리뷰 삭제하기
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
