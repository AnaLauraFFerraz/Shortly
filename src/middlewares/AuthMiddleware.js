import db from "../config/database.js"

export async function authValidation(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Informe o token!");

    try {
        const session = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
        if (session.rows.length === 0) return res.sendStatus(401);
        res.locals.session = session.rows[0];

        next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function urlOwnerValidation(req, res, next) {
  const { userId } = res.locals.session
  const { id } = req.params

  try {
    const { rowCount, rows: [ownerId, ..._] } = await db.query(`SELECT "userId" FROM urls WHERE id = $1;`, [id])
    if (!rowCount) return res.status(404).send("Url doesn't exists")
    if (ownerId.userId !== userId) return res.status(401).send("URL not owned by user")

    next()

  } catch (error) {
    res.status(500).send(error)
  }
}