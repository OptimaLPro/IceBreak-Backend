import * as Controller from "./controller.js";
import express from "express";

const UsersRouter = express.Router();

UsersRouter.get("/users", Controller.getAllUsers);

export default UsersRouter;
