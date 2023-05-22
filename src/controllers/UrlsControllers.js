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

export async function getUrl(req, res) {
    const { id } = req.params

    try {
        const { rowCount, rows: [data, ..._] } = await db.query(`
            SELECT id, "shortUrl", url
            FROM urls
            WHERE id = $1
            `, [id])
        if (!rowCount) return res.sendStatus(404)
        else return res.send(data)
    } catch (error) {
        res.status(500).send(error)
    }
}


export async function deleteUrl(req, res) {
    const { id } = req.params

    try {
        await db.query(`
        DELETE FROM urls
        WHERE id = $1;
        `, [id])
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error)
    }
}