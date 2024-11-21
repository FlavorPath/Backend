const db = require("../utils/db");

// 모든 마커 조회 컨트롤러
exports.getAllMarkers = async (req, res) => {
  try {
    // id, 이름, 카테고리(라벨), 위치{위도: , 경도:}
    const sql = `SELECT id,name,category, 
  JSON_OBJECT('latitude', latitude, 'longitude', longitude) AS location 
  from restaurants`;

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
    const sql = `SELECT id,name,category, 
  JSON_OBJECT('latitude', latitude, 'longitude', longitude) AS location 
  from restaurants WHERE category="${label}"`;

    const [result] = await db.execute(sql);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};
