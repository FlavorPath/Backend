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
 * /api/restaurant/{id}:
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
 * /api/restaurant/{id}/reviews:
 *   get:
 *     summary: "특정 식당의 리뷰 조회"
 *     description: "특정 식당의 리뷰를 커서 기반 페이징 방식으로 조회합니다."
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 식당의 ID
 *       - in: query
 *         name: cursor
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: "커서 기반 페이징을 위한 마지막 리뷰 ID (기본값: 0)"
 *     responses:
 *       '200':
 *         description: 리뷰 조회 성공
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
 *                         description: 리뷰 ID
 *                         example: 1
 *                       nickname:
 *                         type: string
 *                         description: 리뷰를 작성한 유저의 닉네임
 *                         example: "example_nickname"
 *                       profileIcon:
 *                         type: string
 *                         nullable: true
 *                         description: 리뷰를 작성한 유저의 프로필 아이콘 URL
 *                         example: "https://example.com/icon1.png"
 *                       content:
 *                         type: string
 *                         description: 리뷰 내용
 *                         example: "음식이 정말 맛있었어요!"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 리뷰 작성 시간
 *                         example: "2024-11-24T12:34:56.000Z"
 *                 lastCursor:
 *                   type: integer
 *                   nullable: true
 *                   description: 다음 요청에 사용할 마지막 리뷰의 ID
 *                   example: 5
 *       '404':
 *         description: 식당을 찾을 수 없음
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
 *       '500':
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
 *                   example: "서버 오류가 발생했습니다."
 */

// 식당 리뷰 조회
router.get("/:id/reviews", getRestaurantReviews);

/**
 * @swagger
 * /api/restaurant/{id}/reviews:
 *   post:
 *     summary: "특정 식당에 리뷰 작성"
 *     description: "특정 식당에 대한 리뷰를 작성합니다."
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "리뷰를 작성할 식당 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: "리뷰 내용"
 *                 example: "맛있어요! 또 가고 싶어요."
 *     responses:
 *       201:
 *         description: "리뷰 작성 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "리뷰가 성공적으로 작성되었습니다."
 *       400:
 *         description: "잘못된 요청 (유효하지 않은 데이터)"
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
 *                   example: "리뷰 내용을 입력해주세요."
 *       404:
 *         description: "식당을 찾을 수 없음"
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
 *                   example: "리뷰를 작성할 식당을 찾을 수 없습니다."
 *       500:
 *         description: "서버 오류"
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

// 식당 리뷰 작성
router.post("/:id/reviews", authMiddleware, postRestaurantReview);

/**
 * @swagger
 * /api/restaurant/{id}/scrap:
 *   post:
 *     summary: 식당 스크랩 추가/해제
 *     description: 특정 식당을 스크랩하거나, 이미 스크랩된 경우 스크랩을 해제합니다. 인증이 필요합니다.
 *     tags:
 *       - Scrap
 *     security:
 *       - bearerAuth: []  # 인증 필요
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 스크랩할 식당의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: 성공적으로 스크랩 추가 또는 해제
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 스크랩이 추가되었습니다.
 *       404:
 *         description: 요청한 식당을 찾을 수 없음
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
 *                   example: 스크랩할 식당을 찾을 수 없습니다.
 *       401:
 *         description: 인증 실패 (유효하지 않은 또는 누락된 토큰)
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
 *                   example: 인증이 필요합니다.
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


// 식당 스크랩 추가/해제
router.post("/:id/scrap", authMiddleware, toggleScrap);

module.exports = router;
