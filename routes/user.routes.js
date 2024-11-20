const express = require('express');
const { registerUser, loginUser } = require('../controllers/user.controller');
const router = express.Router();

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

module.exports = router;
