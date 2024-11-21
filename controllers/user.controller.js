const bcrypt = require('bcrypt');
const db = require('../utils/db');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, password, nickname } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: '아이디를 입력해주세요!' });
    }
    if (!password) {
        return res.status(400).json({ success: false, message: '비밀번호를 입력해주세요!' });
    }
    if (!nickname) {
        return res.status(400).json({ success: false, message: '닉네임을 입력해주세요!' });
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

// 로그인 컨트롤러
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    
    // 필드 확인
    if (!username) {
        return res.status(400).json({ success: false, message: '아이디를 입력해주세요!' });
    }
    if (!password) {
        return res.status(400).json({ success: false, message: '비밀번호를 입력해주세요!' });
    }

    try {
        // 사용자 조회
        const [result] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = Array.isArray(result) && result.length > 0 ? result[0] : null;

        if (!user) {
            return res.status(404).json({ success: false, message: '존재하지 않는 사용자입니다.' });
        }

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
        }

        // JWT 생성
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // 응답
        res.status(200).json({
            success: true,
            message: '로그인 성공',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};