const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getScraps, deleteScrap } = require("../controllers/scrap.controller");

/**
 * @swagger
 * /api/scrap:
 *   get:
 *     summary: 스크랩 목록 조회
 *     description: 로그인한 사용자의 스크랩된 식당 목록을 조회합니다. 각 식당의 라벨과 메뉴 사진 목록도 포함됩니다.
 *     tags:
 *       - Scrap
 *     security:
 *       - bearerAuth: []  # 인증 필요
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *           default: 0
 *         description: 이전 요청의 마지막 스크랩 ID (페이징용)
 *     responses:
 *       200:
 *         description: 스크랩 목록 조회 성공
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
 *                         example: 3
 *                       restaurantId:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "청진옥"
 *                       address:
 *                         type: string
 *                         example: "서울 종로구 청진동 123"
 *                       labels:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["한식", "국밥"]
 *                       photos:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]
 *                 cursor:
 *                   type: integer
 *                   example: 10
 *       404:
 *         description: 스크랩된 식당을 찾을 수 없음
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
 *                   example: "스크랩된 식당을 찾을 수 없습니다."
 *       401:
 *         description: 인증 실패 (JWT가 필요함)
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
 *                   example: "인증이 필요합니다."
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

// 스크랩 목록 조회
router.get("/", authMiddleware, getScraps);

/**
 * @swagger
 * /api/scrap:
 *   post:
 *     summary: 스크랩 해제
 *     description: 로그인한 사용자가 특정 식당의 스크랩을 해제합니다.
 *     tags:
 *       - Scrap
 *     security:
 *       - bearerAuth: []  # 인증 필요
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: integer
 *                 description: 스크랩 해제할 식당의 ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: 스크랩 해제 성공
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
 *                   example: "스크랩이 성공적으로 해제되었습니다."
 *       400:
 *         description: 잘못된 요청 (레스토랑 ID 누락 또는 요청 형식 오류)
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
 *                   example: "레스토랑 ID가 필요합니다."
 *       404:
 *         description: 스크랩이 존재하지 않거나 이미 해제됨
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
 *                   example: "스크랩이 존재하지 않거나 이미 해제되었습니다."
 *       401:
 *         description: 인증 실패 (JWT가 필요함)
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
 *                   example: "인증이 필요합니다."
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


// 스크랩 해제
router.post("/", authMiddleware, deleteScrap);

module.exports = router;
