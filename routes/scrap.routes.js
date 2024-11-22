const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getScraps } = require("../controllers/scrap.controller");

router.get("/", authMiddleware, getScraps);

module.exports = router;
