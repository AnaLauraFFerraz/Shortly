import db from "../config/database.js"
import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from "uuid"

export async function signUp(req, res) {
    const { name, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)
    try {
        const user = await db.query(`
            INSERT INTO users (name,email,password)
            VALUES ($1,$2,$3)`,
            [name, email, hashedPassword])

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function signIn(req, res) {
    const { email, password } = req.body
    try {
        const {rowCount: userFound, rows: [queryReturnData,..._]} = await db.query(`SELECT id, email, password FROM users where email = $1`, [email])
        if (!userFound) return res.status(401).send("Email ou senha incorretos")

        const passwordCheck = bcrypt.compareSync(password, queryReturnData.password)
        if (!passwordCheck) return res.status(401).send("Email ou senha incorretos")
        const token = uuidV4()
        await db.query(`
        INSERT INTO sessions ("userId", token)
        VALUES ($1,$2)
        `,[queryReturnData.id, token])
        res.send({token})

    } catch (err) {
        res.status(500).send(err.message)
    }
}