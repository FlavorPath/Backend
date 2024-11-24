const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfo,
  changeNickname,
} = require("../controllers/user.controller");
const router = express.Router();
const { updateProfileIcon } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

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

/**
 * @swagger
 * /user/nickname:
 *   put:
 *     summary: 회원 닉네임 변경
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 변경할 닉네임
 *                 example: "새로운닉네임"
 *     responses:
 *       200:
 *         description: 닉네임 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 닉네임 변경 실패 (입력값 검증 실패 또는 동일한 닉네임)
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
 *                   example: "변경할 닉네임을 입력해주세요"
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
// 회원 닉네임 변경
router.put("/nickname", authMiddleware, changeNickname);


/**
 * @swagger
 * /user/profile-icon:
 *   put:
 *     summary: "유저 프로필 아이콘 수정"
 *     description: "S3에 이미지를 업로드하고 유저의 프로필 아이콘을 수정합니다."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: [] # JWT 인증 추가
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileIcon:
 *                 type: string
 *                 format: binary
 *                 description: "업로드할 프로필 이미지 파일"
 *     responses:
 *       200:
 *         description: "프로필 아이콘 수정 성공"
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
 *                   example: "프로필 아이콘이 성공적으로 업데이트되었습니다."
 *                 profileIcon:
 *                   type: string
 *                   description: "업데이트된 프로필 아이콘 URL"
 *                   example: "https://example-bucket.s3.amazonaws.com/profile-icons/icon.png"
 *       400:
 *         description: "잘못된 요청 (파일 없음)"
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
 *                   example: "파일이 제공되지 않았습니다."
 *       404:
 *         description: "유저를 찾을 수 없음"
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
 *                   example: "유저를 찾을 수 없습니다."
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
// 프로필 아이콘 업데이트
router.put('/profile-icon', authMiddleware, upload, updateProfileIcon);
module.exports = router;
