//servizio che esegue le richieste sulle ricette

import RecipeInfo from "./infoModel.js";

export const getRecipes = async () => {
    try {
        const recipes = await RecipeInfo.find();
        return recipes;
    } catch (err) {
        console.error(err);
        throw new Error("Errore nel recupero delle ricette dal DB");
    }
};