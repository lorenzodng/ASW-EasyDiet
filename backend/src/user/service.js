import jwt from 'jsonwebtoken';
import UserAccount from "./accountModel.js";
import UserInfo from "./infoModel.js";
import { sendNotificationToUser } from "../notification/service.js";

/* 
  Service layer:
  Handles user business logic and database operations.
  Called by the controller and returns structured results.
*/

// User login and profile existence check
export const loginUser = async (userData) => {
    const foundUser = await UserAccount.findOne({ email: userData.email }); // Search user by email
    if (!foundUser) {
        return {
            status: false,
            message: "Invalid email or password"
        };
    }
    if (userData.password !== foundUser.password) {
        return {
            status: false,
            message: "Invalid password"
        };
    }

    // JWT token generation (1 hour expiration)
    const token = jwt.sign({
        id: foundUser._id,
        nome: foundUser.nome
    },
        process.env.JWT_SECRET, { expiresIn: "1h" }
    );
    const profile = await UserInfo.findOne({ userId: foundUser._id });
    return {
        status: true,
        message: "User validated",
        hasProfileInfo: !!profile,
        token,
        user: {
            id: foundUser._id.toString(),
            nome: foundUser.nome
        }
    };
};

// Get profile information for a single user
export const getUserProfileInfo = async (userId) => {
    const user = await UserInfo.findOne({ userId });

    if (!user) return null;

    let ultimoPeso = null;

    if (user.pesi.length > 0) {
        ultimoPeso = user.pesi[user.pesi.length - 1].peso; // Get last recorded weight
    } else {
        ultimoPeso = null;
    }

    return {
        ...user.toObject(),
        peso: ultimoPeso
    };
};

// Get all users
export const getAllUsers = async () => {
    return await UserInfo.find();
};

// Save profile information for a single user
export const saveUserProfileInfo = async (userId, profileInfo) => {
    try {
        const { peso } = profileInfo;
        if (typeof peso !== "number" || isNaN(peso) || peso <= 0 || peso > 500) {
            return { status: false, message: "Peso inserito non valido" };
        }
        const existingProfile = await UserInfo.findOne({ userId });
        if (existingProfile) {
            existingProfile.eta = profileInfo.eta;
            existingProfile.peso = profileInfo.peso;
            existingProfile.altezza = profileInfo.altezza;
            existingProfile.sesso = profileInfo.sesso;
            existingProfile.obiettivo = profileInfo.obiettivo;
            existingProfile.obiettivoPeso = profileInfo.obiettivoPeso;
            existingProfile.livelloAttivitaFisica = profileInfo.livelloAttivitaFisica;
            await notifyWeight(existingProfile, peso); // Sends weight notify
            existingProfile.pesi.push({ peso: profileInfo.peso, data: new Date() });
            existingProfile.kcal = Math.round(kcalCalculator(profileInfo.eta, profileInfo.peso, profileInfo.sesso, profileInfo.altezza, profileInfo.livelloAttivitaFisica, profileInfo.obiettivo));
            await existingProfile.save();
        } else {
            const newProfile = {
                ...profileInfo,
                userId,
                pesi: [{ peso: profileInfo.peso, data: new Date() }],
                kcal: Math.round(kcalCalculator(profileInfo.eta, profileInfo.peso, profileInfo.sesso, profileInfo.altezza, profileInfo.livelloAttivitaFisica, profileInfo.obiettivo))
            };
            const newUser = new UserInfo(newProfile);
            await newUser.save();
        }
        return { status: true };
    } catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
};

// Calculate daily calorie need
const kcalCalculator = (eta, peso, sesso, altezza, livelloAttivitaFisica, obiettivo) => {
    const bmr = BMR(eta, peso, sesso, altezza);
    const tdee = TDEE(bmr, livelloAttivitaFisica);
    if (obiettivo === "dimagrimento") {
        return tdee - 300;
    } else if (obiettivo === "mantenimento") {
        return tdee;
    } else if (obiettivo === "aumento peso") {
        return tdee + 300;
    }
};

// Calculates Basal Metabolic Rate (BMR) 
const BMR = (eta, peso, sesso, altezza) => {
    if (sesso === "maschio") {
        return 10 * peso + 6.25 * altezza - 5 * eta + 5;
    } else {
        return 10 * peso + 6.25 * altezza - 5 * eta - 161;
    }
};

// Calculates Total Daily Energy Expenditure (TDEE)
const TDEE = (bmr, livelloAttivitaFisica) => {
    const fattori = {
        basso: 1.2,
        moderato: 1.55,
        intenso: 1.9
    };

    return bmr * fattori[livelloAttivitaFisica];
};

// Send notification based on weight progress
export const notifyWeight = async (user, nuovoPeso) => {
    const pesoPrecedente = user.pesi[user.pesi.length - 1].peso;
    const obiettivo = user.obiettivo;
    const obiettivoPeso = user.obiettivoPeso;
    let payload;
    if (obiettivo === "dimagrimento") {
        if (nuovoPeso <= obiettivoPeso) {
            payload = {
                title: "🎯 Obiettivo raggiunto!",
                body: `Complimenti! Hai raggiunto il tuo obiettivo di ${obiettivoPeso} kg! `
            }
        } else if (nuovoPeso < pesoPrecedente) {
            payload = {
                title: "Ottimo lavoro! 🎉",
                body: "Hai perso peso! Continua così!"
            };
        } else if (nuovoPeso > pesoPrecedente) {
            payload = {
                title: "Aggiornamento peso",
                body: "Sei aumentato di peso, cerca di seguire il tuo piano alimentare!"
            };
        } else {
            return;
        }
    } else if (obiettivo === "aumento peso") {
        if (nuovoPeso >= obiettivoPeso) {
            payload = {
                title: "🎯 Obiettivo raggiunto!",
                body: `Complimenti! Hai raggiunto il tuo obiettivo di ${obiettivoPeso} kg! `
            };
        } else if (nuovoPeso > pesoPrecedente) {
            payload = {
                title: "Ottimo lavoro! 💪",
                body: "Hai guadagnato peso, stai raggiungendo il tuo obiettivo!"
            };
        } else if (nuovoPeso < pesoPrecedente) {
            payload = {
                title: "Aggiornamento peso",
                body: "Hai perso peso, cerca di seguire il tuo piano alimentare!"
            };
        } else {
            return;
        }
    } else if (obiettivo === "mantenimento") {
        if (nuovoPeso !== pesoPrecedente) {
            payload = {
                title: "Aggiornamento peso",
                body: "Il tuo peso è cambiato. Cerca di mantenerlo stabile seguendo il tuo piano alimentare!"
            };
        } else {
            return;
        }
    }
    await sendNotificationToUser(user.userId, payload);
};

// Get the user ID and name from the JWT
export const getUserIdName = async (userId) => {
    const user = await UserAccount.findById(userId).select('_id nome');
    if (!user) throw new Error('Utente non trovato');
    return { id: user._id.toString(), nome: user.nome };
};