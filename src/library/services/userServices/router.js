import * as Controller from "./controller.js";
import express from "express";

const UsersRouter = express.Router();

UsersRouter.get("/users", Controller.getAllUsers);
UsersRouter.post("/users", Controller.createUser);
UsersRouter.get("/userById/:id", Controller.getUserById);
UsersRouter.get("/userByEmail/:email", Controller.getUserByEmail);

export default UsersRouter;
