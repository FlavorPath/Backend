const express = require("express");
const router = express.Router();
const {
  getRestaurantDetail,
  getRestaurantReviews,
  postRestaurantReview,
  toggleScrap,
} = require("../controllers/restaurant.controller");

const authMiddleware = require("../middlewares/authMiddleware");

// 식상 상세 화면 API

/**
 * @swagger
 * /restaurant/{id}:
 *   get:
 *     summary: 식당 상세 조회
 *     description: 특정 식당의 상세 정보를 조회합니다. (라벨, 메뉴, 주소, 영업시간, 전화번호, 스크랩 여부 포함)
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 조회할 식당의 고유 ID
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         required: false
 *         description: 사용자의 JWT 토큰 (스크랩 여부 확인용)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 식당 상세 정보 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurantId:
 *                   type: integer
 *                   description: 식당 고유 ID
 *                 name:
 *                   type: string
 *                   description: 식당 이름
 *                 labels:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 식당에 연결된 라벨 목록
 *                 menu:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: 메뉴 이름
 *                       price:
 *                         type: string
 *                         description: 메뉴 가격
 *                       photo_url:
 *                         type: string
 *                         description: 메뉴 사진 URL
 *                 address:
 *                   type: string
 *                   description: 식당 주소
 *                 hours:
 *                   type: string
 *                   description: 영업시간
 *                 phone:
 *                   type: string
 *                   description: 식당 전화번호
 *                 isScraped:
 *                   type: boolean
 *                   description: 사용자가 해당 식당을 스크랩했는지 여부
 *       404:
 *         description: 식당을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: 식당을 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: 서버 오류가 발생했습니다.
 */

// 식당 상세 조회
router.get("/:id", getRestaurantDetail);

/**
 * @swagger
 * /restaurant/{id}/reviews:
 *   get:
 *     summary: "특정 식당의 리뷰 조회"
 *     description: "특정 식당의 리뷰를 커서 기반 페이징 방식으로 조회합니다."
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "식당 ID"
 *         required: true
 *         schema:
 *           type: integer
 *       - name: cursor
 *         in: query
 *         description: "현재 페이지의 커서. 기본값은 0."
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: "한 번에 가져올 데이터 수. 기본값은 5."
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "리뷰 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *                       content:
 *                         type: string
 *                         example: "맛있어요!"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-22T14:20:15.000Z"
 *                 lastCursor:
 *                   type: integer
 *                   example: 5
 *       404:
 *         description: "식당을 찾을 수 없습니다."
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
 *                   example: "식당을 찾을 수 없습니다."
 *       500:
 *         description: "서버 오류가 발생했습니다."
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
 *                   example: "서버 오류가 발생했습니다."
 */

// 식당 리뷰 조회
router.get("/:id/reviews", getRestaurantReviews);

// 식당 리뷰 작성
router.post("/:id/reviews", authMiddleware, postRestaurantReview);

// 식당 스크랩 추가/해제
router.post("/:id/scrap", authMiddleware, toggleScrap);

module.exports = router;
