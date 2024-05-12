import * as Controller from "./controller.js";
import express from "express";

const UsersRouter = express.Router();

UsersRouter.get("/allUsers", Controller.getAllUsers);
UsersRouter.get("/userById/:id", Controller.getUserById);
UsersRouter.get("/userByEmail/:email", Controller.getUserByEmail);


UsersRouter.post("/createUser", Controller.createUser);
UsersRouter.post("/login", Controller.loginUser);

UsersRouter.put("/:id", Controller.updateUserById);
UsersRouter.put("/password/:id",Controller.changePassword)
//----------------NICE TO HAVE----------------------------
UsersRouter.put("/users/:id/favorites", Controller.addFavorite);


UsersRouter.delete("/users/:id", Controller.deleteUserById);

export default UsersRouter;
