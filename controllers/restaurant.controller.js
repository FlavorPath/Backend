const db = require("../utils/db");
const jwt = require("jsonwebtoken");

// 식당 상세 조회 컨트롤러
exports.getRestaurantDetail = async (req, res) => {
  try {
    const { id } = req.params;
    // 아아디 식당명 주소 영업시간 전화번호 조회
    let sql = `SELECT id, name, address, hours, phone FROM restaurants WHERE id=${id}`;
    const [restaurantInfo] = await db.execute(sql);
    const { name, address, hours, phone } = restaurantInfo[0];
    const restaurantId = restaurantInfo[0].id;

    // 라벨 조회
    sql = `SELECT l.name FROM restaurant_labels rl JOIN labels l ON rl.label_id = l.id
    WHERE rl.restaurant_id = ${id}`;
    const [result] = await db.execute(sql);
    const labels = [];
    result.forEach((label) => labels.push(label.name));

    // 메뉴 데이터 조회
    sql = `SELECT name, price, photo_url FROM menus WHERE restaurant_id = ${id}`;
    const [menuInfo] = await db.execute(sql);

    // 스크랩 여부 조회
    const token = req.headers.authorization?.split(" ")[1];
    let scrap = false;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // 스크랩 여부 확인 후 스크랩 시 값 true로 조정
        sql = `SELECT EXISTS (SELECT 1 FROM scraps WHERE user_id=${userId} AND restaurant_id=${id}) AS scraped`;
        let [result] = await db.execute(sql);
        if (result[0].scraped) scrap = true;
      } catch (err) {
        // 토큰 에러 시 스크랩 여부 false로 유지
        scrap = false;
      }
    }

    // 전달 양식
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
    res.status(404).json({
      success: false,
      message: "식당을 찾을 수 없습니다.",
    });
  }
};

// 식당 리뷰 조회 컨트롤러
exports.getRestaurantReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // 예외처리를 위해 식당이 존재하는지 확인
    let sql = `SELECT COUNT(*) AS exist FROM restaurants WHERE id = ${id}`;
    const [restaurant] = await db.execute(sql);
    if (!restaurant[0].exist) throw Error;

    // 리뷰아이디, 유저네임, 리뷰내용, 작성일자 조회
    // reviews 테이블의 user_id 값을 통해 users 테이블에서 username을 얻어오기 위해 JOIN 사용
    sql = `SELECT reviews.id, users.username, reviews.content, reviews.created_at FROM reviews 
  JOIN users ON reviews.user_id = users.id AND reviews.restaurant_id = ${id}`;

    const [reviews] = await db.execute(sql);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "식당을 찾을 수 없습니다.",
    });
  }
};

// 식당 리뷰 작성 컨트롤러
exports.postRestaurantReview = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    const sql = `INSERT INTO reviews (user_id, restaurant_id, content) VALUES (?, ?, ?)`;
    const values = [userId, restaurantId, content];

    const [result] = await db.execute(sql, values);
    res.status(201).json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "잘못된 요청입니다." });
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
