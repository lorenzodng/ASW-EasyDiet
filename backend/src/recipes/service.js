import RecipeInfo from "./infoModel.js";

/* 
  Service layer:
  Handles dish business logic and database operations.
  Called by the controller and returns structured results.
*/

//Get all dishes
export const getRecipes = async () => {
    try {
        const foundRecipes = await RecipeInfo.find();
        return foundRecipes;
    } catch (err) {
        console.error(err);
        throw new Error("Errore nel recupero dei piatti");
    }
};