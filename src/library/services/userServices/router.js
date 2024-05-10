import * as Controller from "./controller.js";
import express from "express";

const UsersRouter = express.Router();

UsersRouter.get("/users", Controller.getAllUsers);
UsersRouter.get("/userById/:id", Controller.getUserById);
UsersRouter.get("/userByEmail/:email", Controller.getUserByEmail);


UsersRouter.post("/users", Controller.createUser);

UsersRouter.put("/users/:id", Controller.updateUserById);

UsersRouter.delete("/users/:id", Controller.deleteUserById);

export default UsersRouter;
