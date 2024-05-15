import GamesLog from "../../modules/gamesLogModule.js";

export const createGameLog = async (req, res) => {
    console.log(req.body);
    const { owner, pin, players } = req.body;
    try {
        const newGameLog = new GamesLog({
            owner: owner,
            pin: pin,
            players: players,
        });

        await newGameLog.save();

        res.status(201).json({ message: 'Game log created successfully', gameLog: newGameLog });
    } catch (error) {
        console.error('Error creating game log:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllGameLogs = async (req, res) => {
    try {
        const gameLogs = await GamesLog.find();
        console.log(gameLogs);
        res.status(200).json({ gameLogs });
    } catch (error) {
        console.error('Error getting game logs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};