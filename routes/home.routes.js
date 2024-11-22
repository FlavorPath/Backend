const express = require("express");
const router = express.Router();
const {
  getAllMarkers,
  getLabelMarkers,
} = require("../controllers/home.controller");

/**
 * @swagger
 * /home:
 *   get:
 *     summary: 모든 마커 조회
 *     description: 모든 식당의 마커 데이터를 조회합니다. 각 마커에는 id, 이름, 라벨, 위치(위도 및 경도)가 포함됩니다.
 *     tags:
 *       - Markers
 *     responses:
 *       200:
 *         description: 모든 마커 데이터를 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: 식당 ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 식당 이름
 *                     example: "청진옥"
 *                   labels:
 *                     type: array
 *                     description: 라벨 리스트
 *                     items:
 *                       type: string
 *                     example: ["한식", "국밥"]
 *                   location:
 *                     type: object
 *                     description: 위치 정보 (위도 및 경도)
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         description: 위도
 *                         example: 37.5717915
 *                       longitude:
 *                         type: number
 *                         description: 경도
 *                         example: 126.981209
 *       500:
 *         description: 서버 오류가 발생했습니다.
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
// 모든 마커 조회
router.get("/", getAllMarkers);

/**
 * @swagger
 * /home/label:
 *   get:
 *     summary: 특정 라벨에 해당하는 마커 조회
 *     description: 특정 라벨 이름에 해당하는 식당의 마커 데이터를 조회합니다.
 *     tags:
 *       - Markers
 *     parameters:
 *       - in: query
 *         name: label
 *         required: true
 *         description: 검색할 라벨 이름
 *         schema:
 *           type: string
 *           example: "한식"
 *     responses:
 *       200:
 *         description: 특정 라벨에 해당하는 마커 데이터를 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: 식당 ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 식당 이름
 *                     example: "청진옥"
 *                   labels:
 *                     type: array
 *                     description: 라벨 리스트
 *                     items:
 *                       type: string
 *                     example: ["한식", "국밥"]
 *                   location:
 *                     type: object
 *                     description: 위치 정보 (위도 및 경도)
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         description: 위도
 *                         example: 37.5717915
 *                       longitude:
 *                         type: number
 *                         description: 경도
 *                         example: 126.981209
 *       400:
 *         description: 요청 파라미터가 올바르지 않습니다.
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
 *                   example: "잘못된 요청입니다."
 *       500:
 *         description: 서버 오류가 발생했습니다.
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
// 라벨별 마커 조회
router.get("/label", getLabelMarkers);

module.exports = router;
