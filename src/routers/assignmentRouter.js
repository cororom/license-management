import express from "express";
import { getAssignment, getAdd, postAdd, getEdit, postEdit, deleteAssignment } from "../controllers/assignmentController";
import { protectorMiddleware, returnMiddleware } from "../middlewares";

const assignmentRouter = express.Router();

assignmentRouter.get("/null", returnMiddleware);
assignmentRouter.get("/post/null", returnMiddleware);
assignmentRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
assignmentRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteAssignment);
assignmentRouter.route("/add").all(protectorMiddleware).get(getAdd).post(postAdd);
assignmentRouter.route("/post/:page").get(getAssignment);

export default assignmentRouter;
