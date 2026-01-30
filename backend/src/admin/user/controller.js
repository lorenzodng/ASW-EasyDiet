import * as service from "./service.js";

// Controllers follow the same structure:
// they handle HTTP requests, call the service layer
// and return a JSON response with status and data.

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

// Delete user
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

// Get single user info
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

// Get users with diet info
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