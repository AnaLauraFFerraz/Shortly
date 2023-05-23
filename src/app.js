import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRouter from './routers/AuthRouter.js'
import urlsRouter from './routers/UrlsRouter.js'
import usersRouter from './routers/UsersRouter.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use([authRouter, urlsRouter, usersRouter])

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`Server on port ${PORT}`))