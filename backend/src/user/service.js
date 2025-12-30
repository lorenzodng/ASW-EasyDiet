//servizio che esegue le richieste sull'utente

import UserAccount from "./accountModel.js";
import UserInfo from "./infoModel.js";
import { sendNotificationToUser } from "../notification/service.js";

//login e verifica della presenza delle informazioni personali
export const loginUser = async (userData) => {
    const foundUser = await UserAccount.findOne({ email: userData.email }); //cerca nel db un utente la cui email corrisponde a quella indicata dall'utente

    if (!foundUser) {
        return {
            status: false,
            message: "Invalid email or password"
        };
    }

    if (userData.password !== foundUser.password) { //cerca nel db un utente la cui password corrisponde a quella indicata dall'utente
        return {
            status: false,
            message: "Invalid password"
        };
    }

    const profile = await UserInfo.findOne({ userId: foundUser._id }); //verifica la presenza dell'utente nella collezione "users"

    return {
        status: true,
        message: "User validated",
        hasProfileInfo: !!profile, //"!!" converte "profile" in un boolean
        user: {
            id: foundUser._id.toString(),
            nome: foundUser.nome
        }
    };
};

//recupera le informazioni personali
export const getUserProfileInfo = async (userId) => {
    const user = await UserInfo.findOne({ userId });

    if (!user) return null; //se l'utente non esiste

    let ultimoPeso = null;

    if (user.pesi.length > 0) {
        ultimoPeso = user.pesi[user.pesi.length - 1].peso; //prende l'ultimo elemento dell'array "pesi" e il suo valore
    } else {
        ultimoPeso = null;
    }

    return {
        ...user.toObject(),
        peso: ultimoPeso
    };
};

//recupera tutti gli utenti
export const getAllUsers = async () => {
    return await UserInfo.find();
};

//salvataggio delle informazioni personali
export const saveUserProfileInfo = async (userId, profileInfo) => {
    try {
        // cerca il profilo esistente
        const existingProfile = await UserInfo.findOne({ userId });

        if (existingProfile) {
            existingProfile.eta = profileInfo.eta;
            existingProfile.peso = profileInfo.peso;
            existingProfile.altezza = profileInfo.altezza;
            existingProfile.sesso = profileInfo.sesso;
            existingProfile.obiettivo = profileInfo.obiettivo;
            existingProfile.obiettivoPeso = profileInfo.obiettivoPeso;
            existingProfile.livelloAttivitaFisica = profileInfo.livelloAttivitaFisica;
            existingProfile.pesi.push({ peso: profileInfo.peso, data: new Date() });
            // ricalcola kcal
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

const kcalCalculator = (eta, peso, sesso, altezza, livelloAttivitaFisica, obiettivo) => {

    const bmr = BMR(eta, peso, sesso, altezza);
    const tdee = TDEE(bmr, livelloAttivitaFisica);

    if (obiettivo === "dimagrimento") {
        return tdee - 300;
    } else if (obiettivo === "mantenimento") {
        return tdee;
    } else if (obiettivo === "aumento_peso") {
        return tdee + 300;
    }
};

const BMR = (eta, peso, sesso, altezza) => {
    if (sesso === "maschio") {
        return 10 * peso + 6.25 * altezza - 5 * eta + 5;
    } else {
        return 10 * peso + 6.25 * altezza - 5 * eta - 161;
    }
};

const TDEE = (bmr, livelloAttivitaFisica) => {
    const fattori = {
        basso: 1.2,
        moderato: 1.55,
        intenso: 1.9
    };

    return bmr * fattori[livelloAttivitaFisica];
};

//invia la notifica all''utente sull'andamento del peso
export const updateWeight = async (userId, nuovoPeso) => {
    const user = await UserInfo.findOne({ userId });
    if (!user)
        return { status: false, message: "Utente non trovato" };

    //aggiunge il nuovo peso
    user.pesi.push({ peso: nuovoPeso, data: new Date() });
    await user.save();

    //controlla se c'è stato calo di peso
    let payload = { title: "Aggiornamento peso", body: "Il tuo peso è stato aggiornato." };
    if (user.pesi.length > 1 && nuovoPeso < user.pesi[user.pesi.length - 2].peso) {
        payload = { title: "Ottimo lavoro! 🎉", body: "Hai perso peso! Continua così!" };
    }

    await sendNotificationToUser(userId, payload);

    return { status: true };
};

