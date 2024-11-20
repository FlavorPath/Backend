const bcrypt = require('bcrypt');
const db = require('../utils/db');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, password, nickname } = req.body;

    if (!username || !password || !nickname) {
        return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
    }

    try {
        // ID 중복 체크
        const result = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        const existingUser = Array.isArray(result) ? result[0] : []; // 배열인지 확인
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: '이미 존재하는 ID입니다.' });
        }

        // 태그 번호 계산
        const maxTagResult = await db.execute('SELECT MAX(tag_number) AS maxTagNumber FROM users');
        const rows = Array.isArray(maxTagResult) ? maxTagResult[0] : [];
        const maxTagNumber = rows.length > 0 && rows[0]?.maxTagNumber ? rows[0].maxTagNumber : 0;
        const tagNumber = maxTagNumber + 1;
        const tag = `#${String(tagNumber).padStart(2, '0')}`;

        // 비밀번호 해싱
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 사용자 삽입
        await db.execute(
            'INSERT INTO users (username, password, nickname, tag_number, tag) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, nickname, tagNumber, tag]
        );

        res.status(201).json({
            success: true,
            message: '회원가입 성공',
            data: { username, nickname, tag },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

