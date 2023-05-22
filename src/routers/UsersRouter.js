import { Router } from "express";
import { authValidation } from "../middlewares/AuthMiddleware";
import { getUrlsByUser } from "../middlewares/UserMiddleware.js";
import { getUserData, getUsersRanking } from "../controllers/UsersConrollers";

const usersRouter = Router()

usersRouter.get("/users/me", authValidation, getUrlsByUser, getUserData)
usersRouter.get("/ranking", getUsersRanking)

export default usersRouter