import { db } from "../config/database.js"

export async function getUserData(_, res) {
    const { userId } = res.locals.session
    try {
        const { rows: urls } = await db.query(`
            SELECT users.id, users.name, SUM("shortLinks"."visitCount") AS "visitCount", JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', "shortLinks".id,
              'shortUrl', "shortLinks"."shortUrl",
              'url', "shortLinks".url,
              'visitCount', "shortLinks"."visitCount"
            )) AS "shortenedUrls"
            FROM users
            JOIN "shortLinks" ON "shortLinks"."userId" = users.id
            WHERE users.id = $1
            GROUP BY users.id;`,
            [userId],
          );
        
        res.send(urls[0])
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function getUsersRanking(_, res) {
    try {
        const { rows: ranking } = await db.query(`
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
        res.send(ranking)

    } catch (error) {
        res.status(500).send(error)
    }
}
