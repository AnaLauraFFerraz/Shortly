import bcrypt from "bcrypt";

export async function validateSignup(req, res, next) {
  const { email } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (user.rows[0]) return res.status(409).send({ message: "Email já cadastrado" });

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function validateSignin(req, res, next) {
  const { email, password } = req.body;

  try {
    const { rows: user, rowCount: userExist } = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (!userExist) return res.status(401).send({ message: "Os campos não estão corretos" });

    const isPasswordCorrect = bcrypt.compareSync(password, user[0].password);
    if (!isPasswordCorrect) return res.status(401).send({ message: "Os campos não estão corretos" });

    res.locals.user = user;

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlsByUser(req, res, next) {
  const { userId } = res.locals.session;

  const urls = await db.query(`
    SELECT
    json_build_object(
      'id', "shortLinks"."userId",
      'name', users.name,
      'visitCount', SUM("shortLinks"."visitCount"),
      'shortenedUrls', json_agg(
        json_build_object(
          'id', "shortLinks".id,
          'shortUrl', "shortLinks"."shortUrl",
          'url', "shortLinks".url,
          'visitCount', "shortLinks"."visitCount"
        )
      )
    ) AS user
    FROM "shortLinks"
    JOIN users ON users.id = "shortLinks"."userId"
    WHERE "shortLinks"."userId" = $1
    GROUP BY "shortLinks"."userId", users.name
    ORDER BY SUM("shortLinks"."visitCount");`
      , [userId]);

  res.locals.urls = urls.rows;
  
  next();
}