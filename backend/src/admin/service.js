import jwt from "jsonwebtoken";
import AdminAccount from "./infoModel.js";

/* 
  Service layer:
  Handles admin business logic and database operations.
  Called by the controller and returns structured results.
*/

// Admin authentication
export const loginAdmin = async ({ token }) => {
  if (!token) {
    return {
      status: false,
      message: "Token di login mancante"
    };
  }
  const admin = await AdminAccount.findOne({
    token: Number(token),
    ruolo: "admin"
  });
  if (!admin) {
    return {
      status: false,
      message: "Token di login non valido"
    };
  }

  const jwtToken = jwt.sign(
    {
      id: admin._id,
      nome: admin.nome,
      ruolo: admin.ruolo
    },
    process.env.JWT_SECRET, { expiresIn: "1h" }
  );

  return {
    status: true,
    message: "Admin autenticato con successo",
    tokenjwt: jwtToken,
    admin: {
      nome: admin.nome,
      ruolo: admin.ruolo
    }
  };
};