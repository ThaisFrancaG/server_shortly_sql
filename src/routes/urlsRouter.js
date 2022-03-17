import { postUrl } from "../controllers/urlsController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import { Router } from "express";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateTokenMiddleware, postUrl);

export default urlsRouter;
