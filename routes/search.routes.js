const express = require('express');
const { searchRestaurants } = require('../controllers/search.controller');
const router = express.Router();

/**
 * @swagger
 * /search:
 *   get:
 *     summary: 식당 검색
 *     description: 검색 기준에 따라 식당을 검색합니다. "name"은 식당 이름으로 검색하며, "label"은 라벨로 검색합니다.
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: toggle
 *         required: true
 *         description: 검색 기준. "name"은 식당 이름, "label"은 라벨 기준 검색.
 *         schema:
 *           type: string
 *           enum: [name, label]
 *           example: name
 *       - in: query
 *         name: query
 *         required: true
 *         description: 검색 키워드. "name"일 경우 식당 이름을 입력, "label"일 경우 라벨 이름을 입력.
 *         schema:
 *           type: string
 *           example: "청진옥"
 *       - in: query
 *         name: cursor
 *         required: false
 *         description: 현재 페이지의 커서. 기본값은 0.
 *         schema:
 *           type: integer
 *           example: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         description: 한 번에 가져올 데이터 수. 기본값은 10.
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: 검색 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "청진옥"
 *                       address:
 *                         type: string
 *                         example: "서울특별시 종로구 종로3길 32 (청진동)"
 *                       labels:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["한식", "라면"]
 *                       photo_url:
 *                         type: string
 *                         example: "https://example.com/photo.jpg"
 *                 cursor:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락 또는 유효하지 않은 검색 기준)
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
 *                   example: "검색 기준과 키워드를 입력해주세요."
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
 *                   example: "서버 오류가 발생했습니다."
 */


// 식당 검색
router.get('/', searchRestaurants);

module.exports = router;