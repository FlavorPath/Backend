const express = require("express");
const router = express.Router();
const { getAllMarkers } = require("../controllers/home.controller");

router.get("/", getAllMarkers);

module.exports = router;
