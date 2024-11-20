const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});