const db = require("../utils/db");

// 스크랩 목록 조회 컨트롤러
exports.getScraps = async (req, res) => {
  try {
    const userId = req.user.id;
    let { cursor = 0 } = req.query;
    const limit = 10;
    cursor = +cursor;

    // 스크랩 목록 조회
    const sql = `
      SELECT s.id, r.id AS restaurantId, r.name 
      FROM restaurants r 
      JOIN scraps s ON r.id = s.restaurant_id 
      WHERE s.user_id = ?
      AND s.id > ? -- 커서로 레스토랑을 제한
      ORDER BY s.id ASC -- 순차적으로 조회
      LIMIT ?;
    `;
    const params = [userId, cursor, limit];
    const [restaurants] = await db.query(sql, params);

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "스크랩된 식당을 찾을 수 없습니다.",
      });
    }

    // 레스토랑 아이디로 라벨명 조회할 SQL문
    const labelSql = `
      SELECT l.name 
      FROM restaurant_labels rl
      JOIN labels l ON rl.label_id = l.id 
      WHERE rl.restaurant_id = ?;
    `;

    // 출력할 데이터들을 담을 배열
    const restaurantWithLabels = [];

    // restaurants(스크랩 목록)을 순회하며 각 요소마다 SQL문을 실행해 라벨명을 조회
    for (let restaurant of restaurants) {
      const [labels] = await db.execute(labelSql, [restaurant.restaurantId]);
      restaurant.labels = labels.map((label) => label.name);
      restaurantWithLabels.push(restaurant);
    }

    // 다음 요청에 사용할 커서
    const lastCursor =
      restaurantWithLabels.length > 0
        ? restaurantWithLabels[restaurantWithLabels.length - 1].id
        : null;

    res.status(200).json({
      success: true,
      data: restaurantWithLabels,
      cursor: lastCursor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

exports.deleteScrap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurantId } = req.body;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "레스토랑 ID가 필요합니다.",
      });
    }

    const sql = `DELETE FROM scraps WHERE user_id = ? AND restaurant_id = ?`;
    const values = [userId, restaurantId];
    const [result] = await db.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "스크랩이 존재하지 않거나 이미 해제되었습니다.",
      });
    }

    res.status(200).json({
      success: true,
      message: "스크랩이 성공적으로 해제되었습니다.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};
