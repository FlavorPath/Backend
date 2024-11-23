const db = require("../utils/db");

exports.getAllReviews = async (req, res) => {
  const userId = req.user.id;

  const sql = `SELECT id, content, created_at FROM reviews WHERE user_id = ${userId}`;
  const [reviews] = await db.execute(sql);

  res.json(reviews);
};
