const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfo,
  changeNickname,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: 유저 회원가입
 *     description: 유저 아이디, 비밀번호, 닉네임으로 회원가입을 진행합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testUser"
 *               password:
 *                 type: string
 *                 example: "securePassword"
 *               nickname:
 *                 type: string
 *                 example: "testNickname"
 *     responses:
 *       201:
 *         description: 회원가입 성공
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
 *                   example: "회원가입 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "testUser"
 *                     nickname:
 *                       type: string
 *                       example: "testNickname"
 *                     tag:
 *                       type: string
 *                       example: "#01"
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 회원가입
router.post("/register", registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: 유저 로그인
 *     description: 유저 아이디와 비밀번호로 로그인을 진행합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testUser"
 *               password:
 *                 type: string
 *                 example: "securePassword"
 *     responses:
 *       200:
 *         description: 로그인 성공
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
 *                   example: "로그인 성공"
 *                 token:
 *                   type: string
 *                   example: "jwt-token"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
// 로그인
router.post("/login", loginUser);

/**
 * @swagger
 * /user/info:
 *   get:
 *     summary: 사용자 정보 조회
 *     description: 로그인한 사용자의 정보를 조회합니다. JWT 토큰을 사용하여 인증된 사용자만 접근할 수 있습니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # JWT 토큰 인증
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     nickname:
 *                       type: string
 *                       example: "testNickname"
 *                     icon:
 *                       type: string
 *                       example: null
 *                     tag:
 *                       type: string
 *                       example: "#07"
 *       404:
 *         description: 사용자를 찾을 수 없음
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
 *                   example: "사용자를 찾을 수 없습니다."
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

// 회원 정보 조회
router.get("/info", authMiddleware, getUserInfo);

// 회원 닉네임 변경
router.put("/nickname", authMiddleware, changeNickname);

module.exports = router;
