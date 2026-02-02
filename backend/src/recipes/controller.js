import * as service from "./service.js";

/*
  Controller layer:
  Handles HTTP requests and delegates dish-related logic to the service layer.
*/

//Get all dishes
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