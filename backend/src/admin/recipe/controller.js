import * as service from "./service.js";

/*
  Controller layer:
  Handles HTTP requests and delegates dish-related logic to the service layer.
*/

//Create new dish
export const createRecipeController = async (req, res) => {
  try {
    const result = await service.createRecipe(req.body);
    if (result.status) {
      res.json({
        status: true,
        recipe: result.recipe
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
export const deleteRecipeController = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const result = await service.deleteRecipe(recipeId);
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
export const updateRecipeController = async (req, res) => {
  try {
    const result = await service.updateRecipe(
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