import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Game from "./src/library/modules/gamesModule.js";
import dotenv from "dotenv";
import GamesRouter from './src/library/services/gameServices/Router.js';
import CategoriesRouter from './src/library/services/categoriesServices/Router.js';
import TriviaRouter from "./src/library/services/triviaServices/Router.js";
dotenv.config();


const port = 8080;
const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/', GamesRouter);
app.use('/', CategoriesRouter);
app.use('/trivia', TriviaRouter);

// Use process.env to access environment variables
const mongoUserName = process.env.MONGO_USER_NAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUrl = process.env.MONGO_CONNECT_URL;

mongoose
    .connect(
       // `mongodb+srv://IceBreak:Zg1KMYTAcnpXVqD0@icebreak.1bwfasv.mongodb.net/IceBreak?retryWrites=true&w=majority`,
       `mongodb+srv://${mongoUserName}:${mongoPassword}@${mongoUrl}/IceBreak?retryWrites=true&w=majority`,
    )
    .then(() => {
        app.listen(port, () => {
            console.log(`DB is Connected on port ${port}!`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
