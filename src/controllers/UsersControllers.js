import { db } from "../config/database.js"

export async function getUserData(_, res) {
    try {
        const result = res.locals.urls;
        
        res.send(result)
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
