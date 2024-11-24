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
    let sql, params; // SQL 쿼리와 매개변수를 저장할 변수 초기화

    if (toggle === "name") {
      // 식당 이름으로 검색
      sql = `
                SELECT
                    r.id,
                    r.name,
                    r.address,
                    GROUP_CONCAT(DISTINCT l.name) AS labels, -- 식당에 연결된 모든 라벨을 쉼표로 연결하여 반환
                    (SELECT m.photo_url
                     FROM menus m
                     WHERE m.restaurant_id = r.id
                     ORDER BY m.id ASC LIMIT 1) AS photo_url -- 해당 식당의 첫 번째 메뉴 사진 URL을 반환
                FROM restaurants r
                LEFT JOIN restaurant_labels rl ON r.id = rl.restaurant_id -- restaurant_labels 테이블과 LEFT JOIN
                LEFT JOIN labels l ON rl.label_id = l.id -- labels 테이블과 LEFT JOIN
                WHERE r.name LIKE ? AND r.id > ? -- 이름에 키워드가 포함되고, 커서 이후 ID인 레코드만 조회
                GROUP BY r.id -- 식당 ID로 그룹화
                ORDER BY r.id ASC -- 식당 ID 기준 오름차순 정렬
                LIMIT ?; -- 지정된 데이터 수만큼 제한
            `;
      params = [`%${query}%`, cursor, limit]; // SQL에 사용할 매개변수 설정
    } else if (toggle === "label") {
      // 라벨로 검색
      sql = `
                SELECT
                    r.id,
                    r.name,
                    r.address,
                    GROUP_CONCAT(DISTINCT l_all.name) AS labels, -- 해당 식당의 모든 라벨 반환
                    (SELECT m.photo_url
                     FROM menus m
                     WHERE m.restaurant_id = r.id
                     ORDER BY m.id ASC LIMIT 1) AS photo_url -- 해당 식당의 첫 번째 메뉴 사진 URL을 반환
                FROM restaurants r
                JOIN restaurant_labels rl ON r.id = rl.restaurant_id -- restaurant_labels 테이블과 JOIN
                JOIN labels l_search ON rl.label_id = l_search.id -- 검색 기준이 되는 라벨 테이블
                LEFT JOIN restaurant_labels rl_all ON r.id = rl_all.restaurant_id -- 모든 라벨 조회를 위해 다시 JOIN
                LEFT JOIN labels l_all ON rl_all.label_id = l_all.id -- 모든 라벨 조회를 위한 JOIN
                WHERE l_search.name LIKE ? AND r.id > ? -- 검색 기준 라벨 이름과 일치하는 식당만 조회
                GROUP BY r.id -- 식당 ID로 그룹화
                ORDER BY r.id ASC -- 식당 ID 기준 오름차순 정렬
                LIMIT ?; -- 지정된 데이터 수만큼 제한
            `;
      params = [`%${query}%`, cursor, limit]; // SQL에 사용할 매개변수 설정
    } else {
      // 유효하지 않은 toggle 값일 경우 400 Bad Request 응답 반환
      return res
        .status(400)
        .json({ success: false, message: "유효하지 않은 검색 기준입니다." });
    }

    const [rows] = await db.execute(sql, params); // 데이터베이스 실행 및 결과 반환

    if (rows.length === 0) {
      // 결과가 없으면 빈 배열과 null 커서를 반환
      return res.status(200).json({ success: true, data: [], cursor: null });
    }

    const lastCursor = rows[rows.length - 1].id; // 마지막 데이터의 ID를 커서로 설정

    // 성공적인 응답 반환
    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        id: row.id, // 식당 ID
        name: row.name, // 식당 이름
        address: row.address, // 식당 주소
        labels: row.labels ? row.labels.split(",") : [], // 라벨 리스트로 변환
        photo_url: row.photo_url, // 첫 번째 메뉴의 사진 URL
      })),
      cursor: lastCursor, // 다음 요청에 사용할 커서
    });
  } catch (error) {
    // 서버 오류 처리
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};
