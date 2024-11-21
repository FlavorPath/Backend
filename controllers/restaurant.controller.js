const db = require("../utils/db");
const jwt = require("jsonwebtoken");

// 식당 상세 조회 컨트롤러
exports.getRestaurantDetail = async (req, res) => {
  try {
    const { id } = req.params;
    let sql = `SELECT id, name, category, address, hours, phone FROM restaurants WHERE id=${id}`;
    // 이름 라벨 주소 영업시간 전화번호 데이터 조회
    const [restaurantInfo] = await db.execute(sql);
    const { name, category, address, hours, phone } = restaurantInfo[0];
    const restaurantId = restaurantInfo[0].id;

    // 메뉴 데이터 조회
    sql = `SELECT name, price FROM menus WHERE restaurant_id=${id}`;
    const [menuInfo] = await db.execute(sql);

    const token = req.headers.authorization;
    let scrap = false;

    // 스크랩 여부 조회
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // 스크랩 여부 확인 후 스크랩 시 값 true로 조정
      sql = `SELECT EXISTS (SELECT 1 FROM scraps WHERE user_id=${userId} AND restaurant_id=${id}) AS scraped`;
      [result] = await db.execute(sql);
      if (result[0].scraped) scrap = true;
    }

    // 전달 양식
    const detail = {
      restaurantId,
      name,
      category,
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
      message: "찾을 수 없습니다.",
    });
  }
};
