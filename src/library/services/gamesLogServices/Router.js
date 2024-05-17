import * as Controller from './controller.js';
import express from 'express';

const GamesLogRouter = express.Router();

GamesLogRouter.post('/gameslog/create', Controller.createGameLog);
GamesLogRouter.get('/gameslog', Controller.getAllGameLogs);
// GamesRouter.get('/games/:id', Controller.getGameById);

// GamesRouter.post('/games', Controller.updateGame);

// GamesRouter.put('/games/:id', Controller.updateGame);

// GamesRouter.delete('/games/:id', Controller.deleteGame, Controller.deleteGame, Controller.deleteGame);

export default GamesLogRouter;
