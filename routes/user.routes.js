const express = require('express');
const { registerUser, loginUser, getUserInfo } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

// 회원 정보 조회
router.get('/', authMiddleware, getUserInfo);
module.exports = router;
