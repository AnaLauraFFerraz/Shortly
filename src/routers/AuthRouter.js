import { Router } from "express"
import validateSchema from "../middlewares/validateSchema.js"
import { signupSchema, signinSchema } from "../schemas/AuthSchema.js"
import { signUp, signIn } from "../controller/AuthController.js"

const authRouter = Router()

authRouter.post("/signup", validateSchema(signupSchema), signUp)
authRouter.post("/signin", validateSchema(signinSchema), signIn)

export default authRouter