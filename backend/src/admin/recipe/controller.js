import * as service from "./service.js";

// Controllers follow the same structure:
// they handle HTTP requests, call the service layer
// and return a JSON response with status and data.

//Create new recipe
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
    console.error("Errore creazione ricetta:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

// Delete recipe
export const deleteRecipeController = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const result = await service.deleteRecipe(recipeId);

    if (result.status) {
      res.json({
        status: true,
        message: "Ricetta eliminata con successo"
      });
    } else {
      res.json({
        status: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error("Errore eliminazione ricetta:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

// Update recipe
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
    console.error("Errore modifica ricetta:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};