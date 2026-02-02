import DishInfo from "./infoModel.js";

/* 
  Service layer:
  Handles dish business logic and database operations.
  Called by the controller and returns structured results.
*/

//Get all dishes
export const getDishes = async () => {
    try {
        const foundDishes = await DishInfo.find();
        return foundDishes;
    } catch (err) {
        console.error(err);
        throw new Error("Errore nel recupero dei piatti");
    }
};