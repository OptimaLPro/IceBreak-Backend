import * as Controller from './controller.js';
import express from 'express';

const CategoriesRouter = express.Router();

CategoriesRouter.get('/categories', Controller.getAllCategories);

export default CategoriesRouter;
