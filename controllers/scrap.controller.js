const db = require("../utils/db");

// 스크랩 목록 조회 컨트롤러
exports.getScraps = async (req, res) => {
  try {
    const userId = req.user.id;
    let { cursor = 0, limit = 5 } = req.query;
    cursor = +cursor;
    limit = +limit;

    // 리뷰 아이디, 레스토랑 아이디, 이름 조회
    let sql = `SELECT s.id, r.id AS restaurantId, r.name 
           FROM restaurants r 
           JOIN scraps s ON r.id = s.restaurant_id 
           WHERE s.user_id = ?
           AND s.id > ?  -- 커서로 레스토랑을 제한
           ORDER BY r.id ASC  -- 순차적으로 조회
           LIMIT ?`;
    const params = [userId, cursor, limit];
    const [restaurants] = await db.query(sql, params);

    // 레스토랑 아이디로 라벨명 조회할 SQL문
    let labelSql = `SELECT l.name FROM restaurant_labels rl
  JOIN labels l ON rl.label_id = l.id WHERE rl.restaurant_id = ?;`;

    // 출력할 데이터들을 담을 배열
    const restaurantWithLabels = [];

    // restaurants(스크랩 목록)을 순회하며 각 요소마다 SQL문을 실행해 라벨명을 조회
    for (let restaurant of restaurants) {
      const [labels] = await db.execute(labelSql, [restaurant.restaurantId]);
      // 라벨명 배열 형식으로 저장
      restaurant.labels = [];
      labels.forEach((label) => restaurant.labels.push(label.name));
      restaurantWithLabels.push(restaurant);
    }

    // 다음 요청에 사용할 커서
    const lastCursor = restaurantWithLabels[restaurantWithLabels.length - 1].id;
    restaurantWithLabels.push({ lastCursor });

    res.status(200).json(restaurantWithLabels);
  } catch (err) {
    res.json(err);
    // res.status(400).json({ succes: false, message: "잘못된 요청입니다." });
  }
};

// 스크랩 해제 컨트롤러
exports.deleteScap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurantId } = req.body;
    const sql = `DELETE FROM scraps WHERE user_id = ${userId} AND restaurant_id = ${restaurantId}`;
    const [result] = await db.execute(sql);

    // affectedRows에 따라 예외처리
    if (result.affectedRows) res.status(200).json({ succes: true });
    else throw Error;
  } catch (err) {
    res.status(400).json({ succes: false, messagae: "잘못된 요청입니다." });
  }
};
