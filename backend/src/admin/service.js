import AdminAccount from "./infoModel.js";
import UserAccount from "../user/accountModel.js"

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

  return {
    status: true,
    message: "Admin validato",
    admin: {
      nome: admin.nome,
      ruolo: admin.ruolo
    }
  };
};

export const getAllUsers = async () => {
  const users = await UserAccount.find(
    { ruolo: "utente" },
    { password: 0 } // escludiamo la password dal risultato 
  );

  return users;
};
