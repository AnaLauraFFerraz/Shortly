import { db } from "../config/database.js"
import bcrypt from "bcrypt";

export async function validateSignup(req, res, next) {
  const { email } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1;", [email]);

    if (user.rows.length > 0)
      return res.status(409).send({ message: "Usuário já existe" });

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function validateSignin(req, res, next) {
  const { email, password } = req.body;

  try {
    const { rows: user, rowCount: userExist } = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (!userExist) return res.status(401).send({ message: "Usuário ou senha incorretos" });

    const isPasswordCorrect = bcrypt.compareSync(password, user[0].password);
    if (!isPasswordCorrect) return res.status(401).send({ message: "Usuário ou senha incorretos" });

    res.locals.user = user;

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlsByUser(req, res, next) {
  const { userId } = res.locals.session;

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

  res.locals.urls = urls[0];

  next();
}
