
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
import { log } from "console";
import { createGameLog } from "./src/library/services/gamesLogServices/controller.js";
import UsersRouter from './src/library/services/userServices/router.js'
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
})

server.listen(server_port, () => {
  console.log(`Server is running on port ${server_port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/games', GamesRouter)
app.use('/categories', CategoriesRouter)
app.use('/users', UsersRouter)
app.use('/trivia', TriviaRouter)

const rooms = {}

io.on('connection', (socket) => {
  console.log('A user connected ' + socket.id)

  socket.on('createRoom', (roomData) => {
    const { gamePIN } = roomData
    socket.join(gamePIN)
    socket.emit('roomCreated', gamePIN)
    rooms[gamePIN] = {
      owner: socket.id,
      players: [],
    }
    console.log('Room created with ID:', gamePIN)
    console.log('Rooms:', rooms)
  })

  socket.on('checkRoom', (roomData) => {
    const { gamePIN } = roomData
    if (rooms[gamePIN]) {
      socket.emit('roomChecked', true)
    } else {
      socket.emit('roomChecked', false)
    }
  })

  socket.on('getPlayers', ({ gamePIN }) => {
    if (rooms[gamePIN]) {
      socket.emit('playersData', { players: rooms[gamePIN].players })
    }
  })

  socket.on('joinRoom', (roomData) => {
    const { gamePIN, name, avatar } = roomData
    rooms[gamePIN].players.push({ id: socket.id, name, avatar })

    io.to(gamePIN).emit('playerJoined', { id: socket.id, name, avatar })

    const connectedPeopleCount =
      io.sockets.adapter.rooms.get(gamePIN)?.size || 0
    io.to(gamePIN).emit('connectedPeopleCount', connectedPeopleCount)

    socket.join(gamePIN)
    socket.emit('roomJoined', gamePIN)
    console.log('Rooms:', rooms)
  })

  socket.on('checkRoomOwner', (data) => {
    const { gamePIN } = data
    if (rooms[gamePIN] && rooms[gamePIN].owner === socket.id) {
      socket.emit('isRoomOwner', true)
    } else {
      socket.emit('isRoomOwner', false)
    }
  })

  socket.on('startGame', (data) => {
    console.log('Game started with ID:', data.gamePIN)
    io.to(data.gamePIN).emit('gameStarted', true)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected ' + socket.id)
    // Find and remove the disconnected player from the players array
    Object.keys(rooms).forEach((gamePIN) => {
      rooms[gamePIN].players = rooms[gamePIN].players.filter(
        (player) => player.id !== socket.id
      )
      // Emit event to inform all clients in the room that a player left
      io.to(gamePIN).emit('playerLeft', { id: socket.id })
    })
    console.log('Rooms:', rooms)
  })
})


const rooms = {};
const gameData = {};

io.on('connection', (socket) => {
    console.log('A user connected ' + socket.id);

    socket.on('createRoom', (roomData) => {
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
        console.log('Rooms after creating:', rooms);
    });

    socket.on('checkRoom', (roomData) => {
        const { gamePIN } = roomData;
        if (rooms[gamePIN]) {
            socket.emit('roomChecked', true);
        } else {
            socket.emit('roomChecked', false);
        }
    });

    socket.on('updateRoomData', (data) => {
        const { gamePIN } = data;
        const numOfQuestions = rooms[gamePIN].questionsNum;
        // console.log("HERE", socket.id, gameData[socket.id])
        const randomGameData = gameData[socket.id].fetchedQuestions;
        for (let i = randomGameData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomGameData[i], randomGameData[j]] = [randomGameData[j], randomGameData[i]];
        }
        const shuffledQuestions = randomGameData.slice(0, numOfQuestions);
        rooms[gamePIN].questions = shuffledQuestions;
        delete gameData[socket.id];
        // console.log('Updated room data:', rooms[gamePIN]);
        // console.log('Game data:', gameData);
    });

    socket.on('sendRoomData', (data) => {
        gameData[socket.id] = data;
        // console.log('Game data:', gameData);
    });

    socket.on('getRoomData', (data) => {
        const { gamePIN } = data;
        // console.log("game pin", gamePIN)
        // console.log('Sending room data:', rooms[gamePIN])
        socket.emit('resRoomData', rooms[gamePIN].questions);
    });

    socket.on('getPlayers', ({ gamePIN }) => {
        if (rooms[gamePIN]) {
            socket.emit('playersData', { players: rooms[gamePIN].players });
        }
    });

    socket.on('joinRoom', (roomData) => {
        const { gamePIN, name, avatar } = roomData;
        rooms[gamePIN].players.push({ id: socket.id, name, avatar, score: 0 });

        io.to(gamePIN).emit('playerJoined', { id: socket.id, name, avatar, score: 0 });

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

    socket.on('updateScore', (data) => {
        const { gamePIN, timeTaken } = data;
        if (timeTaken === 0) {
            return;
        }
        const maxTime = rooms[gamePIN].questionSec * 1000;
        const normalizedScore = Math.max(1, Math.ceil((maxTime - timeTaken) / (maxTime / 100)));
        const player = rooms[gamePIN].players.find((player) => player.id === socket.id);
        player.score += normalizedScore;
        console.log('Player:', player.score);
    });

    socket.on('getPlayersScore', (data) => {
        const { gamePIN } = data;
        const players = rooms[gamePIN].players;
        players.sort((a, b) => b.score - a.score);
        socket.emit('resPlayersScore', players);
    });

    socket.on('getQuestionSec', (data) => {
        const { gamePIN } = data;
        socket.emit('resQuestionSec', rooms[gamePIN].questionSec);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected ' + socket.id);
        Object.keys(rooms).forEach((gamePIN) => {
            rooms[gamePIN].players = rooms[gamePIN].players.filter(
                (player) => player.id !== socket.id
            );
            io.to(gamePIN).emit('playerLeft', { id: socket.id });
        });
        console.log('Rooms after disconnection:', rooms);
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
  })
  .catch((error) => {
    console.log(error)
  })
