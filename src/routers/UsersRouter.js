import { Router } from "express";
import { getUserData, getUsersRanking } from "../controllers/users.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { getUrlsByUser } from "../middlewares/UserMiddleware.js";

const usersRouter = Router()

usersRouter.get("/users/me", authValidation, getUrlsByUser, getUserData)
usersRouter.get("/ranking", getUsersRanking)

export default usersRouter