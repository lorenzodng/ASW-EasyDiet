//servizio che esegue le richieste sull'utente

import UserAccount from "./accountModel.js";
import UserInfo from "./infoModel.js";

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
    return await UserInfo.findOne({ userId });
};

//salvataggio delle informazioni personali
export const saveUserProfileInfo = async (userId, profileInfo) => {
    try {
        let foundUser = await UserInfo.findOne({ userId: userId });

        if (foundUser) {
            foundUser.set(profileInfo); //aggiorna i campi esistenti con i valori specificati dall'utente
        } else {
            const newProfileInfo = { ...profileInfo, userId }; //aggiungo anche l'id tra le informazioni del profilo
            foundUser = new UserInfo(newProfileInfo); //crea un nuovo profilo utente
        }

        const kcal = kcalCalculator(profileInfo.eta, profileInfo.peso, profileInfo.sesso, profileInfo.altezza, profileInfo.livelloAttivitaFisica, profileInfo.obiettivo);
        foundUser.kcal = Math.round(kcal);
        await foundUser.save();

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
