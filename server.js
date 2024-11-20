const app = require('./app'); // app.js에서 Express 앱 가져오기
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
