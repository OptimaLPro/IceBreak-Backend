import * as Controller from './controller.js';
import express from 'express';

const TriviaRouter = express.Router();

TriviaRouter.get('/allTrivia', Controller.getAllTrivia);
TriviaRouter.get('/triviaByTag/:tag', Controller.getTriviaByTag);

export default TriviaRouter;
