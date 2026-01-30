import jwt from "jsonwebtoken";
import AdminAccount from "./infoModel.js";

// Service layer:
// handles business logic and database operations.
// Called by controllers and returns structured results.

export const loginAdmin = async ({ token }) => {
  if (!token) {
    return {
      status: false,
      message: "Token mancante"
    };
  }

  const admin = await AdminAccount.findOne({
    token: Number(token),
    ruolo: "admin"
  });

  if (!admin) {
    return {
      status: false,
      message: "Token non valido"
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
    message: "Admin validato",
    tokenjwt: jwtToken,
    admin: {
      nome: admin.nome,
      ruolo: admin.ruolo
    }
  };
};