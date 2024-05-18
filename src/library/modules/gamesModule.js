import mongoose from "mongoose";

// Define the schema for the games collection
const gameSchema = new mongoose.Schema({
  name: String,
  active: Boolean,
  title: String,
  tags: [String],
  trailer: String,
  description: String,
  image: String,
  class: String,
  link: String,
});

// Create a Mongoose model based on the schema
const Game = mongoose.model("games", gameSchema); // Use singular "Game" as model name

export default Game;
