import express from "express";
import { home } from "../controllers/licenseController";
import { getLogin, postLogin, getLogout } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);

rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/logout", getLogout);

export default rootRouter;
