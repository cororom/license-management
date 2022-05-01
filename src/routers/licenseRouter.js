import express from "express";
import { home, getLicense, postLicense, getAdd, postAdd, deleteLicense, getEdit, postEdit } from "../controllers/licenseController";
import { protectorMiddleware, returnMiddleware } from "../middlewares";

const licenseRouter = express.Router();

licenseRouter.get("/null", returnMiddleware);
licenseRouter.get("/post/null", returnMiddleware);
licenseRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
licenseRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteLicense);
licenseRouter.route("/post/:page").get(getLicense);
licenseRouter.route("/add").all(protectorMiddleware).get(getAdd).post(postAdd);
licenseRouter.get("/", home);

export default licenseRouter;
