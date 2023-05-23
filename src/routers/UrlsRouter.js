import { Router } from "express";
import { urlSchema } from "../schemas/UrlSchema.js";
import validateSchema from "../middlewares/validateSchema.js";
import { authValidation } from "../middlewares/AuthMiddleware.js";
import { deleteUrl, getUrlById, redirectShortUrl, shortenUrl } from "../controllers/UrlsControllers.js";
import { validateReturnUrl, validateReturnShortUrl } from "../middlewares/UrlMiddleware.js";

const urlsRouter = Router()

urlsRouter.post("/urls/shorten", authValidation, validateSchema(urlSchema), shortenUrl)
urlsRouter.get("/urls/:id", validateReturnUrl, getUrlById)
urlsRouter.get("/urls/open/:shortUrl", validateReturnShortUrl, redirectShortUrl)
urlsRouter.delete("/urls/:id", authValidation, validateReturnUrl, deleteUrl)

export default urlsRouter