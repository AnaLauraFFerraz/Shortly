import db from "../config/database.js"
import { nanoid } from "nanoid"

export async function shortenUrl(req, res) {
    const { url } = req.body
    const { userId } = res.locals.session
    const shortUrl = nanoid()

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

export async function getUrlById(req, res) {
    const { id, shortUrl, url, visitCount } = res.locals.url;

    try {
        res.send({ id, shortUrl, url, visitCount });
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function redirectShortUrl(req, res) {
    const { visitCount, shortUrl, url } = res.locals.url;
    try {
        await db.query(`
            UPDATE "shortLinks" 
            SET "visitCount" = $1 
            WHERE "shortUrl" = $2;`, 
            [visitCount + 1, shortUrl]);
        
        res.redirect(url);
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function deleteUrl(req, res) {
    const shortLinkOwner = res.locals.session;
    const { id, userId } = res.locals.url;

    try {
        if (shortLinkOwner.userId !== userId) return res.status(401).send({ message: "Sem autorização para deletar URL" });

        await db.query(`
        DELETE FROM urls
        WHERE id = $1;
        `, [id])

        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error)
    }
}
