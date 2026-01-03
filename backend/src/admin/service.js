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


export const createUser = async (userData) => { //userdata viene dal frontend
  const nome = userData.nome;
  const email = userData.email;
  const password = userData.password;

  // controllo dei campi
  if (!nome || !email || !password) {
    return {
      status: false,
      message: "Dati mancanti"
    };
  }

  // controllo duplicazione e-mail
  const doubleemail = await UserAccount.findOne({ email });
  if (doubleemail) {
    return {
      status: false,
      message: "Email già registrata"
    };
  }

  const newUser = new UserAccount({
    nome,
    email,
    password
  });

  await newUser.save();

  return {
    status: true,
    user: {
      _id: newUser._id,
      nome: newUser.nome,
      email: newUser.email
    }
  };
};
//senza inviare la password 



export const updateUserEmail = async (userId, email) => {
  if (!email) {
    return {
      status: false,
      message: "Email mancante"
    };
  }

  //controlla duplicati
  const existing = await UserAccount.findOne({ email });
  if (existing) {
    return {
      status: false,
      message: "Email già in uso"
    };
  }

  // aggiornamento
  const updatedUser = await UserAccount.findByIdAndUpdate(  //metodo di mongoose 
    userId,
    { email },
    { new: true } // ritorna il documento aggiornato, quindi restituiesce dopo l'update
  ).select("nome email"); // NON restituiamo password, per filtrare i campi 

  if (!updatedUser) {
    return {
      status: false,
      message: "Utente non trovato"
    };
  }

  // 4️⃣ ritorna dati puliti
  return {
    status: true,
    user: updatedUser
  };
};
