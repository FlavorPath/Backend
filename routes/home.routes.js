const express = require("express");
const router = express.Router();
const {
  getAllMarkers,
  getLabelMarkers,
} = require("../controllers/home.controller");

// 모든 마커 조회
router.get("/", getAllMarkers);

// 라벨별 마커 조회
router.get("/label", getLabelMarkers);

module.exports = router;
