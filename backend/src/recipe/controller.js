//controller che gestisce le richieste sulle ricette

import * as service from "./service.js";

//recupero delle ricette
export const getRecipesController = async (req, res) => {
    try {
        const recipes = await service.getAllRecipes();
        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore nel recupero delle ricette" });
    }
};