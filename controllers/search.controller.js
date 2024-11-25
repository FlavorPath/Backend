const db = require("../utils/db");

exports.searchRestaurants = async (req, res) => {
  const { toggle, query, cursor = 0, limit = 10 } = req.query;

  if (!toggle || !query) {
    return res.status(400).json({ success: false, message: "검색 기준과 키워드를 입력해주세요." });
  }

  let decodedQuery;
  try {
    decodedQuery = decodeURIComponent(query);
  } catch (error) {
    console.error("Decoding error:", error);
    return res.status(400).json({
      success: false,
      message: "잘못된 요청입니다. 쿼리 문자열이 올바르지 않습니다.",
    });
  }


  try {
    const cursorNumber = parseInt(cursor, 10);
    const limitNumber = parseInt(limit, 10);


    let sql, params;
    if (toggle === "name") {
      // 식당 이름으로 검색
      sql = `
        SELECT
          r.id,
          r.name,
          r.address,
          GROUP_CONCAT(DISTINCT l.name) AS labels,
          (SELECT m.photo_url FROM menus m WHERE m.restaurant_id = r.id ORDER BY m.id ASC LIMIT 1) AS photo_url
        FROM restaurants r
        LEFT JOIN restaurant_labels rl ON r.id = rl.restaurant_id
        LEFT JOIN labels l ON rl.label_id = l.id
        WHERE r.name LIKE ? AND r.id > ?
        GROUP BY r.id
        ORDER BY r.id ASC
        LIMIT ?;
      `;
      params = [`%${decodedQuery}%`, cursorNumber, limitNumber];
      console.log(params);
    } else if (toggle === "label") {
      // 라벨로 검색
      sql = `
        SELECT
          r.id,
          r.name,
          r.address,
          GROUP_CONCAT(DISTINCT l_all.name) AS labels,
          (SELECT m.photo_url FROM menus m WHERE m.restaurant_id = r.id ORDER BY m.id ASC LIMIT 1) AS photo_url
        FROM restaurants r
        JOIN restaurant_labels rl ON r.id = rl.restaurant_id
        JOIN labels l_search ON rl.label_id = l_search.id
        LEFT JOIN restaurant_labels rl_all ON r.id = rl_all.restaurant_id
        LEFT JOIN labels l_all ON rl_all.label_id = l_all.id
        WHERE l_search.name LIKE ? AND r.id > ?
        GROUP BY r.id
        ORDER BY r.id ASC
        LIMIT ?;
      `;
      params = [`%${decodedQuery}%`, cursorNumber, limitNumber];
      console.log(params);
    } else {
      // 유효하지 않은 toggle 값
      return res.status(400).json({ success: false, message: "유효하지 않은 검색 기준입니다." });
    }

    const [rows] = await db.query(sql, params);

    if (rows.length === 0) {
      return res.status(200).json({ success: true, data: [], cursor: null });
    }

    const lastCursor = rows[rows.length - 1].id;

    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        labels: row.labels ? row.labels.split(",") : [],
        photo_url: row.photo_url,
      })),
      cursor: lastCursor,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};
