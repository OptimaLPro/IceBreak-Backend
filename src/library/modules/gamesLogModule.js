import mongoose from "mongoose";

const gamesLogSchema = new mongoose.Schema({
    owner: String,
    pin: String,
    players: Object,
});

const GamesLog = mongoose.model("games-logs", gamesLogSchema);

export default GamesLog;

