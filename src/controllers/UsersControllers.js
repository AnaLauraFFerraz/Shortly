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
            SELECT "userId" AS id, users.name AS name, count(*) AS "linksCount", SUM("shortLinks"."visitCount") AS "visitCount"
            FROM "shortLinks"
            LEFT JOIN users ON users.id = "shortLinks"."userId"
            GROUP BY "userId", users.name
            ORDER BY "visitCount" DESC
            LIMIT 10;
        `)
        res.send(ranking)

    } catch (err) {
        res.status(500).send(err.message)
    }
}
