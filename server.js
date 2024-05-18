import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cron from "node-cron";
import { Server } from "socket.io";
import CategoriesRouter from './src/library/services/categoriesServices/Router.js';
import GamesRouter from './src/library/services/gameServices/Router.js';
import TriviaRouter from "./src/library/services/triviaServices/Router.js";
import UsersRouter from './src/library/services/userServices/router.js';
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

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/games', GamesRouter);
app.use('/categories', CategoriesRouter);
app.use('/users', UsersRouter);
app.use('/trivia', TriviaRouter);

cron.schedule('*/5 * * * *', () => {
    try {
        console.log('Rooms before cleanup:', rooms);
        console.log('Cleaning up rooms and gameData');
        for (const gamePIN in rooms) {
            if (rooms[gamePIN].players.length === 0) {
                delete rooms[gamePIN];
                console.log(`Room ${gamePIN} deleted`);
            }
        }
        for (const socketID in gameData) {
            if (!Object.values(rooms).some(room => room.players.find(player => player.id === socketID))) {
                delete gameData[socketID];
                console.log(`Game data for socket ${socketID} deleted`);
            }
        }
        console.log('Cleanup complete');
        console.log('Rooms after cleanup:', rooms);
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
});

const rooms = {};
const gameData = {};

io.on('connection', (socket) => {
    console.log('A user connected ' + socket.id);

    socket.on('createRoom', (roomData) => {
        try {
            const { gamePIN, numQuestions, questionSeconds } = roomData;
            socket.join(gamePIN);
            socket.emit('roomCreated', gamePIN);
            rooms[gamePIN] = {
                owner: socket.id,
                questionsNum: numQuestions,
                questionSec: questionSeconds,
                questions: [],
                players: [],
            };
            console.log('Room created with ID:', gamePIN);
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to create room');
        }
    });

    socket.on('checkRoom', (roomData) => {
        try {
            const { gamePIN } = roomData;
            if (rooms[gamePIN]) {
                socket.emit('roomChecked', true);
            } else {
                socket.emit('roomChecked', false);
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to check room');
        }
    });

    socket.on('updateRoomData', (data) => {
        try {
            const { gamePIN } = data;
            if (rooms[gamePIN] && gameData[socket.id]) {
                const numOfQuestions = rooms[gamePIN].questionsNum;
                const randomGameData = gameData[socket.id].fetchedQuestions;
                for (let i = randomGameData.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [randomGameData[i], randomGameData[j]] = [randomGameData[j], randomGameData[i]];
                }
                const shuffledQuestions = randomGameData.slice(0, numOfQuestions);
                rooms[gamePIN].questions = shuffledQuestions;
                delete gameData[socket.id];
            } else {
                socket.emit('error', 'Room or game data not found');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to update room data');
        }
    });

    socket.on('sendRoomData', (data) => {
        try {
            gameData[socket.id] = data;
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to send room data');
        }
    });

    socket.on('getRoomData', (data) => {
        try {
            const { gamePIN } = data;
            if (rooms[gamePIN]) {
                socket.emit('resRoomData', rooms[gamePIN].questions);
            } else {
                socket.emit('error', 'Room not found');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to get room data');
        }
    });

    socket.on('getPlayers', ({ gamePIN }) => {
        try {
            if (rooms[gamePIN]) {
                socket.emit('playersData', { players: rooms[gamePIN].players });
            } else {
                socket.emit('error', 'Room not found');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to get players');
        }
    });

    socket.on('joinRoom', (roomData) => {
        try {
            const { gamePIN, name, avatar } = roomData;
            if (rooms[gamePIN]) {
                rooms[gamePIN].players.push({ id: socket.id, name, avatar, score: 0 });

                io.to(gamePIN).emit('playerJoined', { id: socket.id, name, avatar, score: 0 });

                const connectedPeopleCount = io.sockets.adapter.rooms.get(gamePIN)?.size || 0;
                io.to(gamePIN).emit('connectedPeopleCount', connectedPeopleCount);

                socket.join(gamePIN);
                socket.emit('roomJoined', gamePIN);
            } else {
                socket.emit('error', 'Room not found');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to join room');
        }
    });

    socket.on('checkRoomOwner', (data) => {
        try {
            const { gamePIN } = data;
            if (rooms[gamePIN] && rooms[gamePIN].owner === socket.id) {
                socket.emit('isRoomOwner', true);
            } else {
                socket.emit('isRoomOwner', false);
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to check room owner');
        }
    });

    socket.on('startGame', (data) => {
        try {
            if (rooms[data.gamePIN]) {
                console.log('Game started with ID:', data.gamePIN);
                io.to(data.gamePIN).emit('gameStarted', true);
            } else {
                socket.emit('error', 'Room not found');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to start game');
        }
    });

    socket.on('updateScore', (data) => {
        try {
            const { gamePIN, timeTaken } = data;
            if (rooms[gamePIN]) {
                if (timeTaken === 0) {
                    return;
                }
                const maxTime = rooms[gamePIN].questionSec * 1000;
                const normalizedScore = Math.max(1, Math.ceil((maxTime - timeTaken) / (maxTime / 100)));
                const player = rooms[gamePIN].players.find((player) => player.id === socket.id);
                if (player) {
                    player.score += normalizedScore;
                    console.log('Player:', player.score);
                } else {
                    socket.emit('error', 'Player not found');
                }
            } else {
                socket.emit('error', 'Room not found');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to update score');
        }
    });

    socket.on('getPlayersScore', (data) => {
        try {
            const { gamePIN } = data;
            if (rooms[gamePIN]) {
                const players = rooms[gamePIN].players;
                players.sort((a, b) => b.score - a.score);
                socket.emit('resPlayersScore', players);
            } else {
                socket.emit('error', 'Room not found');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to get players score');
        }
    });

    socket.on('getQuestionSec', (data) => {
        try {
            const { gamePIN } = data;
            if (rooms[gamePIN]) {
                socket.emit('resQuestionSec', rooms[gamePIN].questionSec);
            } else {
                socket.emit('error', 'Room not found');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to get question seconds');
        }
    });

    socket.on('gameEnd', ({ gamePIN }) => {
        try {
            if (rooms[gamePIN] && rooms[gamePIN].owner === socket.id) {
                delete rooms[gamePIN];
                delete gameData[socket.id];
                io.to(gamePIN).emit('roomDeleted');
                console.log(`Room ${gamePIN} and game data deleted`);
            } else {
                socket.emit('error', 'Room not found or not the owner');
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Failed to end game');
        }
    });

    socket.on('disconnect', () => {
        try {
            console.log('A user disconnected ' + socket.id);
            Object.keys(rooms).forEach((gamePIN) => {
                if (rooms[gamePIN]) {
                    rooms[gamePIN].players = rooms[gamePIN].players.filter(
                        (player) => player.id !== socket.id
                    );
                    io.to(gamePIN).emit('playerLeft', { id: socket.id });
                }
            });
        } catch (error) {
            console.error(error);
        }
    });
});

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
