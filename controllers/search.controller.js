const db = require('../utils/db');

exports.searchRestaurants = async (req, res) => {
    const { toggle, query, cursor = 0, limit = 10 } = req.query;

    if (!toggle || !query) {
        return res.status(400).json({ success: false, message: '검색 기준과 키워드를 입력해주세요.' });
    }

    try {
        let sql, params;

        if (toggle === 'name') {
            // Search by restaurant name
            sql = `
                SELECT 
                    r.id, 
                    r.name, 
                    r.address, 
                    GROUP_CONCAT(l.name) AS labels,
                    (SELECT mp.photo_url 
                     FROM menus m 
                     JOIN menu_photos mp ON m.id = mp.menu_id 
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
            params = [`%${query}%`, cursor, parseInt(limit)];
        } else if (toggle === 'label') {
            // Search by label
            sql = `
                SELECT 
                    r.id, 
                    r.name, 
                    r.address, 
                    GROUP_CONCAT(l.name) AS labels,
                    (SELECT mp.photo_url 
                     FROM menus m 
                     JOIN menu_photos mp ON m.id = mp.menu_id 
                     WHERE m.restaurant_id = r.id 
                     ORDER BY m.id ASC LIMIT 1) AS photo_url
                FROM restaurants r
                JOIN restaurant_labels rl ON r.id = rl.restaurant_id
                JOIN labels l ON rl.label_id = l.id
                WHERE l.name LIKE ? AND r.id > ?
                GROUP BY r.id
                ORDER BY r.id ASC
                LIMIT ?;
            `;
            params = [`%${query}%`, cursor, parseInt(limit)];
        } else {
            return res.status(400).json({ success: false, message: '유효하지 않은 검색 기준입니다.' });
        }

        const [rows] = await db.execute(sql, params);

        if (rows.length === 0) {
            return res.status(200).json({ success: true, data: [], cursor: null });
        }

        const lastCursor = rows[rows.length - 1].id;

        res.status(200).json({
            success: true,
            data: rows.map(row => ({
                id: row.id,
                name: row.name,
                address: row.address,
                labels: row.labels ? row.labels.split(',') : [],
                photo_url: row.photo_url
            })),
            cursor: lastCursor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};
