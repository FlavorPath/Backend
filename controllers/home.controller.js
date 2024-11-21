const db = require("../utils/db");

exports.getAllMarkers = async (req, res) => {
  const sql = `SELECT id,name,category, 
  JSON_OBJECT('latitude', latitude, 'longitude', longitude) AS location 
  from restaurants`;

  const [result] = await db.execute(sql);
  res.status(200).json(result);
};
