import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Game from "./src/library/modules/gamesModule.js";
import dotenv from "dotenv";
import GamesRouter from './src/library/services/gameServices/Router.js';
import CategoriesRouter from './src/library/services/categoriesServices/Router.js';
import http from "http";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import GamesLogRouter from "./src/library/services/gamesLogServices/Router.js";
import TriviaRouter from "./src/library/services/triviaServices/Router.js";
dotenv.config();

const port = 8080;
const server_port = 3001;
const app = express();
app.use(bodyParser.json());
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
app.use('/trivia', TriviaRouter);
app.use('/', GamesLogRouter);

const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected ' + socket.id);

    socket.on('createRoom', (roomData) => {
        const { gamePIN } = roomData;
        socket.join(gamePIN);
        socket.emit('roomCreated', gamePIN);
        rooms[gamePIN] = {
            owner: socket.id,
            players: [],
        };
        console.log('Room created with ID:', gamePIN);
        console.log('Rooms:', rooms);
    });

    socket.on('checkRoom', (roomData) => {
        const { gamePIN } = roomData;
        if (rooms[gamePIN]) {
            socket.emit('roomChecked', true);
        } else {
            socket.emit('roomChecked', false);
        }
    });

    socket.on('getPlayers', ({ gamePIN }) => {
        if (rooms[gamePIN]) {
            socket.emit('playersData', { players: rooms[gamePIN].players });
        }
    });

    socket.on('joinRoom', (roomData) => {
        const { gamePIN, name, avatar } = roomData;
        rooms[gamePIN].players.push({ id: socket.id, name, avatar });

        io.to(gamePIN).emit('playerJoined', { id: socket.id, name, avatar });

        const connectedPeopleCount = io.sockets.adapter.rooms.get(gamePIN)?.size || 0;
        io.to(gamePIN).emit('connectedPeopleCount', connectedPeopleCount);

        socket.join(gamePIN);
        socket.emit('roomJoined', gamePIN);
        console.log('Rooms:', rooms);
    });

    socket.on('checkRoomOwner', (data) => {
        const { gamePIN } = data;
        if (rooms[gamePIN] && rooms[gamePIN].owner === socket.id) {
            socket.emit('isRoomOwner', true);
        } else {
            socket.emit('isRoomOwner', false);
        }
    });

    socket.on('startGame', (data) => {
        console.log('Game started with ID:', data.gamePIN);
        io.to(data.gamePIN).emit('gameStarted', true);
    });


    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected ' + socket.id);
        // Find and remove the disconnected player from the players array
        Object.keys(rooms).forEach((gamePIN) => {
            rooms[gamePIN].players = rooms[gamePIN].players.filter(
                (player) => player.id !== socket.id
            );
            // Emit event to inform all clients in the room that a player left
            io.to(gamePIN).emit('playerLeft', { id: socket.id });
        });
        console.log('Rooms:', rooms);
    });
});




app.use("/games", GamesRouter);
app.use("/categories", CategoriesRouter);
app.use("/users", UsersRouter);
// Start server

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
  
