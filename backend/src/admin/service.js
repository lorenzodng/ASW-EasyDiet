import AdminAccount from "./infoModel.js";
import UserAccount from "../user/accountModel.js"
import User from "../user/infoModel.js";
import Diet from "../diet/infoModel.js";
import Notification from "../notification/infoModel.js";
import Recipe from "../recipes/infoModel.js";

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



export const deleteUserService = async (userId) => {
  // controllo ID
  if (!userId) {
    return {
      status: false,
      message: "ID utente mancante"
    };
  }

  // verifica esistenza account
  const userAccount = await UserAccount.findById(userId);
  if (!userAccount) {
    return {
      status: false,
      message: "Utente non trovato"
    };
  }

  // elimina dati collegati
  await Notification.deleteMany({ userId });
  await Diet.deleteMany({ userId });
  await User.findOneAndDelete({ userId });

  // elimina account
  await UserAccount.findByIdAndDelete(userId);

  return {
    status: true,
    message: "Utente e dati associati eliminati con successo"
  };
};


export const getUserInfoService = async (userId) => {
  if (!userId) {
    return {
      status: false,
      message: "ID utente mancante"
    };
  }

  const info = await User.findOne({ userId });

  if (!info) {
    return {
      status: false,
      message: "Nessuna informazione personale trovata"
    };
  }

  return {
    status: true,
    info
  };
};


//recipe 
export const createRecipe = async (recipeData) => {
  const {
    nome,
    categoria,
    ingredienti,
    kcal,
    info
  } = recipeData;

  // controllo campi obbligatori
  if (!nome || !categoria || !ingredienti || ingredienti.length === 0 || !kcal) {
    return {
      status: false,
      message: "Dati mancanti"
    };
  }

  // (opzionale) controllo duplicato nome
  const existingRecipe = await Recipe.findOne({ nome });
  if (existingRecipe) {
    return {
      status: false,
      message: "Ricetta già esistente"
    };
  }

  const newRecipe = new Recipe({
    nome,
    categoria,
    ingredienti,
    kcal,
    info
  });

  await newRecipe.save();

  return {
    status: true,
    recipe: newRecipe
  };
};


export const deleteRecipe = async (recipeId) => {
  if (!recipeId) {
    return {
      status: false,
      message: "ID ricetta mancante"
    };
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    return {
      status: false,
      message: "Ricetta non trovata"
    };
  }

  await Recipe.findByIdAndDelete(recipeId);

  return {
    status: true
  };
};


export const updateRecipe = async (id, data) => {
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return {
      status: false,
      message: "Ricetta non trovata"
    };
  }

  recipe.nome = data.nome;
  recipe.categoria = data.categoria;
  recipe.ingredienti = data.ingredienti;
  recipe.kcal = data.kcal;
  recipe.info = data.info;

  await recipe.save();

  return {
    status: true,
    recipe
  };
};
