const db = require("../utils/db");

exports.getAllReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `SELECT id, restaurant_id, content, created_at FROM reviews WHERE user_id = ${userId}`;
    const [reviews] = await db.execute(sql);

    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "작성된 리뷰가 없습니다." });
  }
};
