import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import CategoriesRouter from "./src/library/services/categoriesServices/Router.js";
import GamesRouter from "./src/library/services/gameServices/Router.js";
import UsersRouter from "./src/library/services/userServices/router.js";
dotenv.config();

const port = 8080;
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", GamesRouter);
app.use("/", CategoriesRouter);
app.use("/", UsersRouter);
// Start server

mongoose
  .connect(
    `mongodb+srv://oa8993:eG99qGFO6USiXP7N@icebreak.qyuoeac.mongodb.net/IceBreak?retryWrites=true&w=majority&appName=IceBreak`
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`DB is Connected on port ${port}!`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
