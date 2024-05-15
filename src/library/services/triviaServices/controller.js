import Trivia from "../../modules/triviaModule.js";

export const getAllTrivia = async (req, res) => {
    try {
        console.log("inside trivia");
        const trivia = await Trivia.find();
        console.log(trivia);
        if (!trivia) {
            throw new Error('No trivia found');
        }
        res.json(trivia);
        console.log(trivia);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


export const getTriviaByTag = async (req, res) => {
    const { tag } = req.params; 
    try {
        const trivia = await Trivia.find({ tags: { $in: [tag] } });
        if (!trivia) {
            res.status(404).json(error.message);
        }
        res.json(trivia);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

