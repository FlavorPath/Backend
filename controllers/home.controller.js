const db = require("../utils/db");

// 모든 마커 조회 컨트롤러
exports.getAllMarkers = async (req, res) => {
  try {
    // id, 이름, 카테고리(라벨), 위치{위도: , 경도:}
    const sql = `SELECT r.id, r.name, 
    JSON_ARRAY(GROUP_CONCAT(l.name ORDER BY l.id ASC SEPARATOR ',')) AS labels, 
  JSON_OBJECT('latitude', r.latitude, 'longitude', r.longitude) AS location
  FROM restaurants r
  JOIN restaurant_labels rl ON r.id = rl.restaurant_id
  JOIN labels l ON rl.label_id = l.id
  GROUP BY r.id; `;

    const [result] = await db.execute(sql);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

// 라벨별 마커 조회 컨트롤러
exports.getLabelMarkers = async (req, res) => {
  try {
    const { label } = req.query;
    // id, 이름, 카테고리(라벨), 위치{위도: , 경도:}
    const sql = `SELECT r.id, r.name, JSON_ARRAYAGG(l.name) AS labels, 
  JSON_OBJECT('latitude', r.latitude, 'longitude', r.longitude) AS location
  FROM restaurants r
  JOIN restaurant_labels rl ON r.id = rl.restaurant_id
  JOIN labels l ON rl.label_id = l.id
  WHERE  l.name = "${label}"
  GROUP BY r.id;
`;

    const [result] = await db.execute(sql);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};
