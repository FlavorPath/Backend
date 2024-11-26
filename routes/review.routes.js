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

/**
 * @swagger
 * /user/review/{id}:
 *   get:
 *     summary: 특정 리뷰 불러오기
 *     tags:
 *       - User Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     responses:
 *       200:
 *         description: 특정 리뷰 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 리뷰 ID
 *                 restaurant_id:
 *                   type: integer
 *                   description: 리뷰가 작성된 식당 ID
 *                 content:
 *                   type: string
 *                   description: 리뷰 내용
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: 리뷰 작성 날짜
 *       404:
 *         description: 리뷰를 찾을 수 없음
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
 *                   example: 리뷰를 찾을 수 없습니다.
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
// 기존 리뷰 불러오기
router.get("/:id", authMiddleware, getReview);

/**
 * @swagger
 * /user/review/{id}:
 *   put:
 *     summary: 리뷰 수정하기
 *     tags:
 *       - User Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 리뷰 내용
 *                 example: "수정된 리뷰 내용"
 *     responses:
 *       200:
 *         description: 리뷰 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 updatedAt:
 *                   type: string
 *                   format: date
 *                   description: 리뷰가 수정된 날짜
 *                   example: "2024-11-24"
 *       400:
 *         description: 리뷰 수정 실패 (입력값 검증 실패 또는 동일한 내용)
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
 *                   example: "리뷰를 작성해주세요"
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
 *                   example: "서버 오류가 발생했습니다"
 */
// 리뷰 수정하기
router.put("/:id", authMiddleware, changeReview);

/**
 * @swagger
 * /user/review/{id}:
 *   delete:
 *     summary: 리뷰 삭제하기
 *     tags:
 *       - User Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: 리뷰를 찾을 수 없음
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
 *                   example: "리뷰를 찾을 수 없습니다."
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
 *                   example: "서버 오류가 발생했습니다"
 */
// 리뷰 삭제하기
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
