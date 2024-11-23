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

// 리뷰 수정하기
exports.changeReview = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    // 입력값이 빈칸일 시 예외처리
    if (!content || !content.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "리뷰를 작성해주세요" });
    }

    const sql = `UPDATE reviews SET content=? WHERE id=?`;
    const params = [content, id];

    const [result] = await db.execute(sql, params);

    // result.info의 Changed 요소로 변경 여부 확인
    const isChanged = Number(result.info.split(/\s+/)[4]);
    if (isChanged) {
      res.status(200).json({ success: true });
    }
    // 변경값이 없을 시 예외처리
    else
      res
        .status(400)
        .json({ success: false, message: "기존 리뷰와 동일합니다" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM reviews WHERE id = ${id}`;
    const [result] = await db.execute(sql);
    if (result.affectedRows) {
      res.status(200).json({ success: true });
    } else {
      res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
};
