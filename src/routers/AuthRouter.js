import { Router } from "express"
import validateSchema from "../middlewares/validateSchema.js"
import { signupSchema, signinSchema } from "../schemas/AuthSchema.js"
import { validateSignup, validateSignin } from "../middlewares/UserMiddleware.js"
import { signUp, signIn } from "../controller/AuthController.js"

const authRouter = Router()

authRouter.post("/signup", validateSchema(signupSchema), validateSignup, signUp)
authRouter.post("/signin", validateSchema(signinSchema), validateSignin, signIn)

export default authRouter