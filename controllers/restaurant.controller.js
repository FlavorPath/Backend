const db = require("../utils/db");
const jwt = require("jsonwebtoken");

// 식당 상세 조회 컨트롤러
exports.getRestaurantDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // 식당 정보 조회
    let sql = `SELECT id, name, address, hours, phone FROM restaurants WHERE id = ?`;
    const [restaurantInfo] = await db.execute(sql, [id]);

    if (restaurantInfo.length === 0) {
      // 식당이 존재하지 않을 경우
      return res.status(404).json({
        success: false,
        message: "식당을 찾을 수 없습니다.",
      });
    }

    const { name, address, hours, phone } = restaurantInfo[0];
    const restaurantId = restaurantInfo[0].id;

    // 라벨 조회
    sql = `SELECT l.name 
           FROM restaurant_labels rl 
           JOIN labels l ON rl.label_id = l.id 
           WHERE rl.restaurant_id = ?`;
    const [result] = await db.execute(sql, [id]);
    const labels = result.map((label) => label.name);

    // 메뉴 데이터 조회
    sql = `SELECT name, price, photo_url 
           FROM menus 
           WHERE restaurant_id = ?`;
    const [menuInfo] = await db.execute(sql, [id]);

    // 스크랩 여부 조회
    const token = req.headers.authorization?.split(" ")[1];
    let scrap = false;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // 스크랩 여부 확인
        sql = `SELECT EXISTS (SELECT 1 
                              FROM scraps 
                              WHERE user_id = ? AND restaurant_id = ?) AS scraped`;
        const [scrapResult] = await db.execute(sql, [userId, id]);
        if (scrapResult[0].scraped) scrap = true;
      } catch (err) {
        // 토큰 검증 오류 처리
        console.error("토큰 검증 오류:", err.message);
        scrap = false;
      }
    }

    // 응답 데이터
    const detail = {
      restaurantId,
      name,
      labels,
      menu: menuInfo,
      address,
      hours,
      phone,
      isScraped: scrap,
    };

    res.status(200).json(detail);
  } catch (err) {
    // 서버 오류 처리
    console.error("서버 오류 발생:", err.message);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

// 식당 리뷰 조회 컨트롤러
exports.getRestaurantReviews = async (req, res) => {
  try {
    const { id } = req.params;
    let { cursor = 0, limit = 5 } = req.query;
    cursor = +cursor;
    limit = +limit;

    // 예외처리를 위해 식당이 존재하는지 확인
    let sql = `SELECT COUNT(*) AS exist FROM restaurants WHERE id = ?`;
    const [restaurant] = await db.execute(sql, [id]);

    if (!restaurant[0].exist) {
      // 식당이 없을 경우 404 응답
      return res.status(404).json({
        success: false,
        message: "식당을 찾을 수 없습니다.",
      });
    }

    // 리뷰 조회
    sql = `SELECT reviews.id, users.username, reviews.content, reviews.created_at 
           FROM reviews 
           JOIN users ON reviews.user_id = users.id 
           WHERE reviews.restaurant_id = ? AND reviews.id > ?
           ORDER BY reviews.id ASC 
           LIMIT ?;`;
    const params = [id, cursor, limit];
    const [reviews] = await db.query(sql, params);

    if (reviews.length === 0) {
      // 리뷰가 없을 경우 200 응답
      return res.status(200).json({
        success: true,
        reviews: [],
        lastCursor: null,
      });
    }

    const lastCursor = reviews[reviews.length - 1].id;

    res.status(200).json({
      success: true,
      reviews,
      lastCursor,
    });
  } catch (err) {
    // 서버 오류 발생 시 500 응답
    console.error(err);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

// 식당 리뷰 작성 컨트롤러
exports.postRestaurantReview = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    // 요청 데이터 유효성 검사
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "리뷰 내용을 입력해주세요.",
      });
    }

    // 식당 존재 여부 확인
    const sqlCheckRestaurant = `SELECT COUNT(*) AS exist FROM restaurants WHERE id = ?`;
    const [restaurant] = await db.execute(sqlCheckRestaurant, [restaurantId]);

    if (!restaurant[0].exist) {
      return res.status(404).json({
        success: false,
        message: "리뷰를 작성할 식당을 찾을 수 없습니다.",
      });
    }

    // 리뷰 삽입
    const sqlInsertReview = `INSERT INTO reviews (user_id, restaurant_id, content) VALUES (?, ?, ?)`;
    const values = [userId, restaurantId, content];

    await db.execute(sqlInsertReview, values);

    res.status(201).json({
      success: true,
      message: "리뷰가 성공적으로 작성되었습니다.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};



exports.toggleScrap = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const userId = req.user.id;

    // 스크랩 여부 조회
    let sql = `SELECT COUNT(*) AS exist FROM scraps WHERE user_id=? AND restaurant_id=?`;
    const values = [userId, restaurantId];
    const [scrap] = await db.execute(sql, values);

    // 스크랩 여부에 따라 SQL문 변경
    if (scrap[0].exist) {
      sql = `DELETE FROM scraps WHERE user_id=? AND restaurant_id=?`;
    } else {
      sql = `INSERT INTO scraps (user_id, restaurant_id) VALUES (?, ?)`;
    }

    const [result] = await db.execute(sql, values);
    res.status(201).json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "잘못된 요청입니다." });
  }
};
