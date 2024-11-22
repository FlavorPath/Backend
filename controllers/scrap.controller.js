const db = require("../utils/db");

// 스크랩 목록 조회 컨트롤러
exports.getScraps = async (req, res) => {
  try {
    // 레스토랑아이디, 이름, 라벨
    const userId = req.user.id;

    // 레스토랑 아이디, 이름 조회
    let sql = `SELECT r.id, r.name FROM restaurants r JOIN scraps s
  ON r.id = s.restaurant_id WHERE s.user_id = ${userId}`;
    const [restaurants] = await db.execute(sql);

    // 레스토랑 아이디로 라벨명 조회할 SQL문
    let labelSql = `SELECT l.name FROM restaurant_labels rl
  JOIN labels l ON rl.label_id = l.id WHERE rl.restaurant_id = ?;`;

    // 출력값을 담을 배열
    const restaurantWithLabels = [];

    // restaurants(스크랩 목록)를 순회하며 각 요소마다 SQL문을 실행해 라벨명을 조회
    for (let restaurant of restaurants) {
      const [labels] = await db.execute(labelSql, [restaurant.id]);
      // 라벨명 배열 형식으로 저장
      restaurant.labels = [];
      labels.forEach((label) => restaurant.labels.push(label.name));
      restaurantWithLabels.push(restaurant);
    }
    res.status(200).json(restaurantWithLabels);
  } catch (err) {
    res.json({ succes: false, message: "잘못된 요청입니다." });
  }
};
