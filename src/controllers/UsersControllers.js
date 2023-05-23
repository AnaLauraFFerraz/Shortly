import db from "../config/database.js"

export async function getUserData(_, res) {
    const { userId } = res.locals.session
    try {
        const { rowCount, rows: [data, ..._] } = await db.query(`
        SELECT
        json_build_object(
            'id' , users.id,
            'name' , users.name,
            'visitCount', SUM(urls."visitCount"),
            'shortenedUrls', array_agg(
                                        json_build_object(
                                        'id',urls.id, 
                                        'shortUrl',	urls."shortUrl", 
                                        'url', urls.url,
                                        'visitCount',	urls."visitCount"
                                        ) order by urls.id ASC
									  )
            ) 
        FROM urls
        JOIN users
        ON users.id = urls."userId"
        WHERE users.id = $1
        group by  users.id;
        `, [userId])
        if (rowCount) res.send(data.json_build_object)
        else res.send({})

    } catch (error) {
        res.status(500).send(error)
    }
}

// export const getUserData = async (req, res) => {
//     const user = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
//     const urls = await db.query('SELECT * FROM shortLinks WHERE userId = $1', [req.user.id]);
//     const visitCount = urls.rows.reduce((acc, url) => acc + url.visitCount, 0);
//     res.json({
//       ...user.rows[0],
//       visitCount,
//       shortenedUrls: urls.rows,
//     });
//   };


export async function getUsersRanking(_, res) {
    try {
        const { rowCount, rows: data } = await db.query(`
        SELECT 
	        users.id as "id",
	        users.name as "name",
	        COUNT(urls.*) as "linksCount",
	        COALESCE(SUM(urls."visitCount"),0) as "visitCount" 
	    FROM urls
	    RIGHT JOIN users
	    	ON users.id = urls."userId"
	    group by  users.id
	    order by "visitCount" DESC
	    limit 10;
        `)
        if (rowCount) res.send(data)
        else res.send({})

    } catch (error) {
        res.status(500).send(error)
    }
}

// export const getUsersRanking = async (req, res) => {
//     const users = await db.query(`
//       SELECT users.id, users.name, COUNT(shortLinks.id) AS linksCount, SUM(shortLinks.visitCount) AS visitCount
//       FROM users
//       LEFT JOIN shortLinks ON users.id = shortLinks.userId
//       GROUP BY users.id
//       ORDER BY visitCount DESC, linksCount DESC
//       LIMIT 10
//     `);
//     res.json(users.rows);
//   };