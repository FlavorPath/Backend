const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getScraps, deleteScap } = require("../controllers/scrap.controller");

// 스크랩 목록 조회
router.get("/", authMiddleware, getScraps);
router.post("/", authMiddleware, deleteScap);

module.exports = router;
