import * as service from "./service.js";

/*
  Controller layer:
  Handles HTTP requests and delegates user-related logic to the service layer.
*/

// Get all users
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

// Create new user
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

// Update user email
export const updateEmailUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email } = req.body;
    const result = await service.updateEmail(userId, email);
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
    console.error("Errore aggiornamento email:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

// Delete user
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await service.deleteUser(id);
    if (!result.status) {
      return res.status(404).json(result);
    }

    return res.json(result);

  } catch (error) {
    console.error("Errore eliminazione utente:", error);
    res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }

};

// Get single user info
export const getUserInfoController = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await service.getUserInfo(userId);
    if (!result.status) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("Errore recupero informazioni utente:", error);
    return res.status(500).json({
      status: false,
      message: "Errore server"
    });
  }
};

// Get users with diet info
export const getUsersWithDietController = async (req, res) => {
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