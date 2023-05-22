import { getUrlsByUser } from "../repositories/repository.js";
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

