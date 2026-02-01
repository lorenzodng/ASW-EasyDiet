import RecipeInfo from "./infoModel.js";

export const getRecipes = async () => {
    try {
        const foundRecipes = await RecipeInfo.find();
        return foundRecipes;
    } catch (err) {
        console.error(err);
        throw new Error("Errore nel recupero delle ricette dal DB");
    }
};