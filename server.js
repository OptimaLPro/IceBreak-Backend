import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import CategoriesRouter from "./src/library/services/categoriesServices/Router.js";
import GamesRouter from "./src/library/services/gameServices/Router.js";
import UsersRouter from "./src/library/services/userServices/router.js";
import { createUser } from "./src/library/services/userServices/controller.js";
dotenv.config();

const port = 8080;
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/", GamesRouter);
app.use("/", CategoriesRouter);
app.use("/", UsersRouter);
app.post("/users",createUser);


// Use process.env to access environment variables
// const mongoUserName = process.env.MONGO_USER_NAME;
// const mongoPassword = process.env.MONGO_PASSWORD;
// const mongoUrl = process.env.MONGO_CONNECT_URL;

mongoose
  .connect(`mongodb://localhost:27017/IceBreak`)
  .then(() => {
    app.listen(port, () => {
      console.log(`DB is Connected on port ${port}!`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
