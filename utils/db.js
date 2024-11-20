const mariadb = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
// RDS 연결 설정
const connection = mariadb.createConnection({
    host: process.env.DATABASE_ENDPOINT, // RDS 엔드포인트
    user: process.env.DATABASE_USER, // RDS 사용자 이름
    password: process.env.DATABASE_PASSWORD, // RDS 비밀번호
    database: 'my_flavor', // 데이터베이스 이름
    port: 3306, // 기본 MySQL 포트
    dateStrings: true,
});

// 연결 테스트
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected successfully!');
    }
});

module.exports = connection;
