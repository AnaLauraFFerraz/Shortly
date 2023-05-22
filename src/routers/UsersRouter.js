import { Router } from "express";
import { getUserData, getUsersRanking } from "../controllers/users.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { getUrlsByUser } from "../middlewares/UserMiddleware.js";

const usersDataRouter = Router()

usersDataRouter.get("/users/me", authValidation, getUrlsByUser, getUserData)
usersDataRouter.get("/ranking", getUsersRanking)

export default usersDataRouter