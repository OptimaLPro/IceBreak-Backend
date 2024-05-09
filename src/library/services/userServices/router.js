import * as Controller from "./controller.js";
import express from "express";

const UsersRouter = express.Router();

UsersRouter.get("/users", Controller.getAllUsers);
UsersRouter.post("/users", Controller.createUser);

export default UsersRouter;
