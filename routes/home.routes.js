const express = require("express");
const router = express.Router();
const {
  getAllMarkers,
  getLabelMarkers,
} = require("../controllers/home.controller");

router.get("/", getAllMarkers);
router.get("/label", getLabelMarkers);

module.exports = router;
