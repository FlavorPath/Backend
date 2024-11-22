const express = require('express');
const { searchRestaurants } = require('../controllers/search.controller');
const router = express.Router();

// 식당 검색
router.get('/', searchRestaurants);

module.exports = router;