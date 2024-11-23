const db = require("../utils/db");

exports.getAllReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `SELECT id, restaurant_id, content, created_at FROM reviews WHERE user_id = ${userId}`;
    const [reviews] = await db.execute(sql);

    if (!reviews.length) {
      return res
        .status(404)
        .json({ success: false, message: "작성된 리뷰가 없습니다." });
    }
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
};

// 기존 리뷰 불러오기 (리뷰 수정 페이지로 이동 시)
exports.getReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const sql = `SELECT id, restaurant_id, content, created_at FROM reviews WHERE id = ${reviewId}`;
    const [review] = await db.execute(sql);

    if (!review.length) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다" });
    }
    res.status(200).json(review);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
};
