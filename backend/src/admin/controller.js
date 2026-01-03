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
