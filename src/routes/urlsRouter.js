import { deleteUrl, getUrl, postUrl } from "../controllers/urlsController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import { Router } from "express";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateTokenMiddleware, postUrl);
urlsRouter.get("/urls/:shortUrl", getUrl);
urlsRouter.delete("urls/:id", validateTokenMiddleware, deleteUrl);
export default urlsRouter;
