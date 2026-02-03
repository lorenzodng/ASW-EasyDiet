import UserAccount from "../../user/accountModel.js";
import User from "../../user/infoModel.js";
import Diet from "../../diet/infoModel.js";
import Notification from "../../notification/infoModel.js";

/* 
  Service layer:
  Handles user business logic and database operations.
  Called by controllers and returns structured results.
*/

// Get all users
export const getAllUsers = async () => {
  try {
    const users = await UserAccount.find(
      { ruolo: "utente" },
      { password: 0 }
    );
    return users;
  } catch (err) {
    console.error(err);
    throw new Error("Errore nel recupero dei piatti");
  }
};

// Get all users with diet
export const getAllUsersWithDiet = async () => {
  const diets = await Diet.find().populate({
    path: "userId",
    select: "email"
  });
  const userIds = diets.map(d => d.userId._id);
  const profiles = await User.find({ userId: { $in: userIds } }).select("userId obiettivo kcal");
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

// Create new user
export const createUser = async (userData) => {
  const nome = userData.nome;
  const email = userData.email;
  const password = userData.password;
  if (!nome || !email || !password) {
    return {
      status: false,
      message: "Dati mancanti"
    };
  }
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

// Update user email
export const updateEmail = async (userId, email) => {
  if (!email) {
    return {
      status: false,
      message: "Email mancante"
    };
  }
  const existing = await UserAccount.findOne({ email });
  if (existing) {
    return {
      status: false,
      message: "Email già in uso"
    };
  }
  const updatedUser = await UserAccount.findByIdAndUpdate(
    userId,
    { email },
    { new: true }
  ).select("nome email");

  if (!updatedUser) {
    return {
      status: false,
      message: "Utente non trovato"
    };
  }
  return {
    status: true,
    user: updatedUser
  };
};

// Delete user
export const deleteUser = async (userId) => {
  if (!userId) {
    return {
      status: false,
      message: "ID utente mancante"
    };
  }
  const userAccount = await UserAccount.findById(userId);
  if (!userAccount) {
    return {
      status: false,
      message: "Utente non trovato"
    };
  }
  await Notification.deleteMany({ userId });
  await Diet.deleteMany({ userId });
  await User.findOneAndDelete({ userId });
  await UserAccount.findByIdAndDelete(userId);
  return {
    status: true,
    message: "Utente e dati associati eliminati con successo"
  };
};

// Get single user info
export const getUserInfo = async (userId) => {
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