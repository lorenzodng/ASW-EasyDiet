import AdminAccount from "./infoModel.js";
import UserAccount from "../user/accountModel.js"
import User from "../user/infoModel.js";
import Diet from "../diet/infoModel.js";
import Notification from "../notification/infoModel.js";
import RecipeInfo from "../recipes/infoModel.js";

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
  try {
    const users = await UserAccount.find(
      { ruolo: "utente" },
      { password: 0 } // escludiamo la password dal risultato 
    );
    return users;
  } catch (err) {
    console.error(err);
    throw new Error("Errore nel recupero delle ricette dal DB");
  }
};

export const getAllUsersWithDiet = async () => {
  // 1️⃣ Recupera tutte le diete e popola l'account con email/nome
  const diets = await Diet.find().populate({
    path: "userId",
    select: "email"
  }); //recupera le diete e le email degli utenti associati 

  const userIds = diets.map(d => d.userId._id); //recupera gli id degli utenti
  const profiles = await User.find({ userId: { $in: userIds } }).select("userId obiettivo kcal"); //recupera solo gli utenti che hanno una dieta

  //raggruppa i dati
  const usersWithDiet = diets.map(d => {
    const profile = profiles.find(p => p.userId.toString() === d.userId._id.toString());
    return {
      _id: d.userId._id,
      email: d.userId.email,
      obiettivo: profile?.obiettivo || null,
      kcal: profile?.kcal || null
    };
  });

  return usersWithDiet;
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
    immagine,
    ingredienti,
    kcal,
    info
  } = recipeData;

  // controllo campi obbligatori
  if (!nome || !categoria || !immagine || !ingredienti || ingredienti.length === 0 || !kcal) {
    return {
      status: false,
      message: "Dati mancanti"
    };
  }
  // (opzionale) controllo duplicato nome
  const existingRecipe = await RecipeInfo.findOne({ nome });
  if (existingRecipe) {
    return {
      status: false,
      message: "Ricetta già esistente"
    };
  }

  const newRecipe = new RecipeInfo({
    nome,
    categoria,
    immagine,
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

  const recipe = await RecipeInfo.findById(recipeId);

  if (!recipe) {
    return {
      status: false,
      message: "Ricetta non trovata"
    };
  }

  await RecipeInfo.findByIdAndDelete(recipeId);

  return {
    status: true
  };
};


export const updateRecipe = async (id, data) => {
  const recipe = await RecipeInfo.findById(id);

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

//diet

export const createDiet = async (dietData) => {
  try {
    const { userId, settimana } = dietData;

    // controlli minimi
    if (!userId || !settimana) {
      return {
        status: false,
        message: "Dati mancanti"
      };
    }

    // controllo: una dieta per utente
    const existingDiet = await Diet.findOne({ userId });

    if (existingDiet) {
      return {
        status: false,
        message: "Questo utente ha già una dieta"
      };
    }

    // creazione nuova dieta
    const newDiet = new Diet({
      userId,
      settimana
    });

    // salvataggio su MongoDB
    await newDiet.save();

    return {
      status: true,
      diet: newDiet
    };

  } catch (error) {
    console.error("Errore service dieta:", error);
    return {
      status: false,
      message: "Errore durante la creazione della dieta"
    };
  }
};


export const deleteDiet = async (dietId) => {
  if (!dietId) {
    return {
      status: false,
      message: "ID dieta mancante"
    };
  }

  const diet = await Diet.findById(dietId);

  if (!diet) {
    return {
      status: false,
      message: "Dieta non trovata"
    };
  }

  await Diet.findByIdAndDelete(dietId);

  return {
    status: true
  };
};


export const updateDiet = async (id, data) => {
  const diet = await Diet.findById(id);

  if (!diet) {
    return {
      status: false,
      message: "Dieta non trovata"
    };
  }

  diet.settimana = data.settimana;

  await diet.save();

  return {
    status: true,
    diet
  };
};
