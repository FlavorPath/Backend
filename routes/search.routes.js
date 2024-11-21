const express = require('express');
const { searchRestaurant } = require('../controllers/search.controller');
const router = express.Router();

// 식당 검색
router.get('/', searchRestaurant);

module.exports = router;