import * as Controller from './controller.js';
import express from 'express';

const GamesRouter = express.Router();

GamesRouter.get('/allGames', Controller.getAllGames);
// GamesRouter.get('/games/:id', Controller.getGameById);

// GamesRouter.post('/games', Controller.updateGame);

// GamesRouter.put('/games/:id', Controller.updateGame);

// GamesRouter.delete('/games/:id', Controller.deleteGame, Controller.deleteGame, Controller.deleteGame);

export default GamesRouter;
