import Game from "../../modules/gamesModule.js";

export const getAllGames = ("/games", async (req, res) => {
    try {
        const games = await Game.find();
        if (!games) {
            return res.status(404).json({ error: "No games found" });
        }
        res.json(games);
        console.log(games);
    } catch (error) {
        console.log("Error fetching games:", error);
        res.status(500).json({ error: "Error fetching games" });
    }
});
