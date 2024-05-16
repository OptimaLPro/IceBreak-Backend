import mongoose from "mongoose";

const triviaSchema = new mongoose.Schema({
  question: {
    type: String
  },
  tags: {
    type: [String]
  },
  options: {
    type: [String]
  },
});

const Trivia = mongoose.model("trivias", triviaSchema);

export default Trivia;