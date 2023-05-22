import { getUrlsByUser } from "../repositories/repository.js";
import bcrypt from "bcrypt";

export async function validateCreateUser(req, res, next) {
  const { email } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (user.rows[0]) return res.status(409).send({ message: "Email já cadastrado" });

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
