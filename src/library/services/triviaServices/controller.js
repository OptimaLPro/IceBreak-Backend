import Trivia from "../../modules/triviaModule.js";

export const getAllTrivia = async (req, res) => {
    try {
        console.log("inside trivia");
        const trivia = await Trivia.find();
        console.log(trivia);
        if (!trivia) {
            return res.status(404).json({ error: "No trivia found" });
        }
        res.json(trivia);
        console.log(trivia);
    } catch (error) {
        console.log("Error fetching trivia:", error);
        res.status(500).json({ error: "Error fetching trivia" });
    }
};


export const getTriviaByTagg = async (req, res) => {
    const { tag } = req.params; 
    try {
        const trivia = await Trivia.find({ tags: { $in: [tag] } });
        if (!trivia) {
            return res.status(404).json({ error: "No trivia found for the selected tag" });
        }
        res.json(trivia);
    } catch (error) {
        console.error("Error fetching trivia by tag:", error);
        res.status(500).json({ error: "Error fetching trivia by tag" });
    }
};

