const express = require("express");
const router = express.Router();
const db = require("../utils/db");
router.use(express.json());

router.get("/", async (req, res) => {
  const [result] = await db.execute(`SELECT id,name,category, JSON_OBJECT(
    'latitude', latitude,
    'longitude', longitude) AS location from restaurants`);
  res.json(result);
});

module.exports = router;
