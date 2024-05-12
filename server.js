import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Game from "./src/library/modules/gamesModule.js";
import dotenv from "dotenv";
import GamesRouter from './src/library/services/gameServices/Router.js';
import CategoriesRouter from './src/library/services/categoriesServices/Router.js';
import http from "http";
import { Server } from "socket.io";
dotenv.config();

const port = 8080;
const server_port = 3001;
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

server.listen(server_port, () => {
    console.log(`Server is running on port ${server_port}`);
});



app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/', GamesRouter);
app.use('/', CategoriesRouter);


io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle room creation
    socket.on('createRoom', (roomData) => {
        const { roomId, playerName } = roomData;
        // Create a new room with the given roomId and playerName
        socket.join(roomId);
        // Emit an event to confirm room creation
        socket.emit('roomCreated', roomId);
        console.log('Room created with ID:', roomId);
    });

    // Handle joining a room
    socket.on('joinRoom', (roomData) => {
        const { roomId, playerName } = roomData;
        // Join the specified room
        socket.join(roomId);
        // Emit an event to confirm joining the room
        socket.emit('roomJoined', roomId);
        // Broadcast to others in the room that a new player has joined
        socket.to(roomId).emit('playerJoined', playerName);
    });

    // Handle game actions
    socket.on('gameAction', (actionData) => {
        const { roomId, action } = actionData;
        // Broadcast the game action to all players in the room
        io.to(roomId).emit('gameAction', action);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});




// Use process.env to access environment variables
const mongoUserName = process.env.MONGO_USER_NAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUrl = process.env.MONGO_CONNECT_URL;

mongoose
    .connect(
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
