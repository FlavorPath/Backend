const multer = require('multer');

// 메모리 스토리지 설정 (버퍼 형태로 저장)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload.single('profileIcon'); // 'profileIcon'은 클라이언트가 보낼 필드명
