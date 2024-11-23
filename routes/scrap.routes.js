const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getScraps, deleteScap } = require("../controllers/scrap.controller");

/**
 * @swagger
 * /scrap:
 *   get:
 *     summary: 스크랩 목록 조회
 *     description: 로그인한 사용자의 스크랩된 식당 목록을 조회합니다.
 *     tags:
 *       - Scrap
 *     security:
 *       - bearerAuth: []  # 인증 필요
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         description: 이전 요청의 마지막 스크랩 ID (페이징용)
 *         example: 5
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: 반환할 스크랩 개수
 *         example: 10
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
 *                       labels:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["한식", "국밥"]
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

// 스크랩 해제
router.post("/", authMiddleware, deleteScap);

module.exports = router;
