const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ success: false, message: '토큰이 제공되지 않았습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ success: false, message: '유효하지 않은 토큰입니다.' });
    }
};

module.exports = authMiddleware;
