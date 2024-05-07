import Categories from "../../modules/categoriesModule.js";

export const getAllCategories = ("/categories", async (req, res) => {
    try {
        const categories = await Categories.find();
        if (!categories) {
            return res.status(404).json({ error: "No categories found" });
        }
        res.json(categories);
        console.log(categories);
    } catch (error) {
        console.log("Error fetching categories:", error);
        res.status(500).json({ error: "Error fetching categories" });
    }
});
