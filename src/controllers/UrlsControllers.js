import db from "../config/db.js"
import { nanoid } from "nanoid"

export async function shortenUrl(req, res) {
    const { url } = req.body
    const { userId } = res.locals.session
    const shortUrl = nanoid(8)

    try {
        await db.query(`
            INSERT INTO "shortLinks"("userId", "shortUrl", url)
            VALUES($1, $2, $3);`
            , [userId, shortUrl, url],
        );
        res.status(201).send({ id: userId, shortUrl });
    } catch (error) {
        res.status(500).send(error)
    }
}

