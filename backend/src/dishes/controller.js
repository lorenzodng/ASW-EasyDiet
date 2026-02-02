import * as service from "./service.js";

/*
  Controller layer:
  Handles HTTP requests and delegates dish-related logic to the service layer.
*/

//Get all dishes
export const getDishesController = async (req, res) => {
    try {
        const dishes = await service.getDishes();
        res.json({
            status: true,
            dishes: dishes
        });
    } catch (error) {
        console.error("Errore recupero piatti:", error);
        res.status(500).json({
            status: false,
            message: "Errore server"
        });
    }
};