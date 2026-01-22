import * as service from "./service.js";

export const adminController = async (req, res) => {
  try {
    console.log("ADMIN LOGIN BODY:", req.body);

    const result = await service.loginAdmin(req.body);

    if (result.status) {
      res.send({
        status: true,
        message: result.message,
        admin: result.admin
      });
    } else {
      res.send({
        status: false,
        message: result.message
      });
    }
  } catch (err) {
    console.error("Errore login admin:", err);
    res.status(500).send({
      status: false,
      message: "Server error"
    });
  }
};

export const getUsersController = async (req, res) => {
  try {
    const users = await service.getAllUsers();

    res.json({
      status: true,
      users: users
    });
  } catch (error) {
    console.error("Errore recupero utenti:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

export const createUserController = async (req, res) => {
  try {
    const result = await service.createUser(req.body);

    if (result.status) {
      res.json({
        status: true,
        user: result.user
      });
    } else {
      res.json({
        status: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error("Errore creazione utente:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

export const updateemailUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email } = req.body;

    const result = await service.updateUserEmail(userId, email);

    if (result.status) {
      res.json({
        status: true,
        user: result.user
      });
    } else {
      res.json({
        status: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error("Errore update user:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await service.deleteUserService(id);

    if (!result.status) {
      return res.status(404).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error("Errore delete user:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }

};

export const getUserInfoController = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await service.getUserInfoService(userId);

    if (!result.status) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Errore controller getUserInfo:", error);
    return res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

export const getUsersInfoController = async (req, res) => {
  try {
    const users = await service.getAllUsersWithDiet();
    res.json({
      status: true,
      users: users
    });
  } catch (error) {
    console.error("Errore recupero utenti con dieta:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};


//recipe 
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


//diets
export const createDietController = async (req, res) => {
  try {
    const result = await service.createDiet(req.body);

    if (result.status) {
      res.json({
        status: true,
        recipe: result.diet
      });
    } else {
      res.json({
        status: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error("Errore creazione dieta:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

export const deleteDietController = async (req, res) => {
  try {
    const dietId = req.params.id;
    const result = await service.deleteDiet(dietId);

    if (result.status) {
      res.json({
        status: true,
        message: "Dieta eliminata con successo"
      });
    } else {
      res.json({
        status: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error("Errore eliminazione dieta:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};


export const updateDietController = async (req, res) => {
  try {
    const result = await service.updateDiet(
      req.params.id,
      req.body
    );

    if (!result.status) {
      return res.status(400).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error("Errore modifica Dieta:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};