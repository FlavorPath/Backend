const express = require("express");
const router = express.Router();
const getAllMarkers = require("../controllers/user.controller");

router.get("/", getAllMarkers);

module.exports = router;
