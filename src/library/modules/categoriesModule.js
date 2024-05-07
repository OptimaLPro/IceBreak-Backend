import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: String,
    tag: String,
    });

const Category = mongoose.model("categories", categorySchema);

export default Category;

