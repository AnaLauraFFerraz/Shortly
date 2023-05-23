import { db } from "../config/database.js"

export async function validateReturnUrl(req, res, next) {
  const { id } = req.params;

  const url = await db.query(`SELECT * FROM "shortLinks" WHERE id = $1;`, [id]);
  if (!url.rows[0]) return res.status(404).send({ message: "URL inserida não existe" });

  res.locals.url = url.rows[0];
  
  next();
}

export async function validateReturnShortUrl(req, res, next) {
  const { shortUrl } = req.params;

  const url = await db.query(`SELECT * FROM "shortLinks" WHERE "shortUrl" = $1;`, [shortUrl]);
  if (!url.rows[0]) return res.status(404).send({ message: "URL inserida não existe" });

  res.locals.url = url.rows[0];

  next();
}
