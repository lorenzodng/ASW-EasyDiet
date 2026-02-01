// Controller that handles dish-related requests

import * as service from "./service.js";

export const getRecipesController = async (req, res) => {
    try {
        const recipes = await service.getRecipes();
        res.json({
            status: true,
            recipes: recipes
        });
    } catch (error) {
        console.error("Errore recupero piatti:", error);
        res.status(500).json({
            status: false,
            message: "Errore server"
        });
    }
};