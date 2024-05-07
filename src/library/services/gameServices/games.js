
require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';



export const getAllGames = (req, res) => {
  res.json(games);
};
