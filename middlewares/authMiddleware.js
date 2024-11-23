const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization 헤더가 제공되지 않았습니다.' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Bearer 토큰 형식이 잘못되었습니다.' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 요청 객체에 사용자 정보 추가
        next();

    } catch (error) {
        console.error(error);

        // JWT 에러 종류에 따라 에러 메시지 개선
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ success: false, message: '유효하지 않은 토큰입니다.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ success: false, message: '토큰이 만료되었습니다.' });
        }

        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

module.exports = authMiddleware;
