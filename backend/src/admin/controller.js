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
