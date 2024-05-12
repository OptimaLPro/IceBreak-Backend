import * as Controller from "./controller.js";
import express from "express";

const UsersRouter = express.Router();

UsersRouter.get("/users", Controller.getAllUsers);
UsersRouter.get("/userById/:id", Controller.getUserById);
UsersRouter.get("/userByEmail/:email", Controller.getUserByEmail);


UsersRouter.post("/users", Controller.createUser);
UsersRouter.post("/users/login", Controller.loginUser);

UsersRouter.put("/users/:id", Controller.updateUserById);
UsersRouter.put("/users/password/:id",Controller.changePassword)
//----------------NICE TO HAVE----------------------------
UsersRouter.put("/users/:id/favorites", Controller.addFavorite);


UsersRouter.delete("/users/:id", Controller.deleteUserById);

export default UsersRouter;
