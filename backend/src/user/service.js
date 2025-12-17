//servizio principale

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
        userId: foundUser._id
    };
}

//salvataggio delle informazioni personali
export const saveUserInfo = async (profileInfo) => {
    try {
        const foundUser = await UserInfo.findOne({ userId: profileInfo.userId });

        if (foundUser) {
            await UserInfo.updateOne({ userId: profileInfo.userId }, { $set: profileInfo }); //aggiorna i campi esistenti con i valori specificati dall'utente
        } else {
            const newProfile = new UserInfo(profileInfo); //crea un nuovo profilo utente
            await newProfile.save(); //lo salva nel db
        }

        return { status: true };
    } catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
};