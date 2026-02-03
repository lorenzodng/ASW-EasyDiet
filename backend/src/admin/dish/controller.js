import * as service from "./service.js";

/*
  Controller layer:
  Handles HTTP requests and delegates dish-related logic to the service layer.
*/

//Create new dish
export const createDishController = async (req, res) => {
  try {
    const result = await service.createDish(req.body);
    if (result.status) {
      res.json({
        status: true,
        dish: result.dish
      });
    } else {
      res.json({
        status: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error("Errore creazione piatto:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

// Delete dish
export const deleteDishController = async (req, res) => {
  try {
    const dishId = req.params.id;
    const result = await service.deleteDish(dishId);
    if (result.status) {
      res.json({
        status: true,
        message: "Piatto eliminato con successo"
      });
    } else {
      res.json({
        status: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error("Errore eliminazione piatto:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

// Update dish
export const updateDishController = async (req, res) => {
  try {
    const result = await service.updateDish(
      req.params.id,
      req.body
    );
    if (!result.status) {
      return res.status(400).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error("Errore modifica piatto:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};