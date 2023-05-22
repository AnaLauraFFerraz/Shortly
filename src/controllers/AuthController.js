import db from "../config/db.js"
import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from "uuid"

export async function signUp(req, res) {
    const { name, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)
    try {
        const {rowCount: hasEmail} = await db.query("SELECT email FROM users where email = $1;",[email])
        
        if (hasEmail) return res.status(409).send("Email already exists")

        const user = await db.query(`
        INSERT INTO users (name,email,password)
        VALUES ($1,$2,$3)`,
        [name, email, hashedPassword])

        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }

}

