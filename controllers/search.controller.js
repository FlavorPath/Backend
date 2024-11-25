const db = require("../utils/db");

exports.searchRestaurants = async (req, res) => {
  const { toggle, query, cursor = 0 } = req.query; // 클라이언트 요청에서 검색 기준(toggle), 검색 키워드(query), 커서(cursor) 추출

  const limit = 10; // 가져올 데이터 수(limit) 10으로 고정

  if (!toggle || !query) {
    // 검색 기준이나 키워드가 없으면 400 Bad Request 응답 반환
    return res
        .status(400)
        .json({ success: false, message: "검색 기준과 키워드를 입력해주세요." });
  }

  try {
    // URL-encoded된 query를 디코딩
    const decodedQuery = decodeURIComponent(query);

    let sql, params; // SQL 쿼리와 매개변수를 저장할 변수 초기화

    if (toggle === "name") {
      // 식당 이름으로 검색
      sql = `
                SELECT
                    r.id,
                    r.name,
                    r.address,
                    GROUP_CONCAT(DISTINCT l.name) AS labels,
                    (SELECT m.photo_url
                     FROM menus m
                     WHERE m.restaurant_id = r.id
                     ORDER BY m.id ASC LIMIT 1) AS photo_url
                FROM restaurants r
                LEFT JOIN restaurant_labels rl ON r.id = rl.restaurant_id
                LEFT JOIN labels l ON rl.label_id = l.id
                WHERE r.name LIKE ? AND r.id > ?
                GROUP BY r.id
                ORDER BY r.id ASC
                LIMIT ?;
            `;
      params = [`%${decodedQuery}%`, cursor, limit]; // 디코딩된 query를 사용
    } else if (toggle === "label") {
      // 라벨로 검색
      sql = `
                SELECT
                    r.id,
                    r.name,
                    r.address,
                    GROUP_CONCAT(DISTINCT l_all.name) AS labels,
                    (SELECT m.photo_url
                     FROM menus m
                     WHERE m.restaurant_id = r.id
                     ORDER BY m.id ASC LIMIT 1) AS photo_url
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
      params = [`%${decodedQuery}%`, cursor, limit]; // 디코딩된 query를 사용
    } else {
      // 유효하지 않은 toggle 값일 경우 400 Bad Request 응답 반환
      return res
          .status(400)
          .json({ success: false, message: "유효하지 않은 검색 기준입니다." });
    }

    const [rows] = await db.execute(sql, params);

    if (rows.length === 0) {
      // 결과가 없으면 빈 배열과 null 커서를 반환
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
    console.error(error);
    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

