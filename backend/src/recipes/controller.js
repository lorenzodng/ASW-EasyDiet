//controller che gestisce le richieste sulle ricette

import * as service from "./service.js";

//recupero dei piatti
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