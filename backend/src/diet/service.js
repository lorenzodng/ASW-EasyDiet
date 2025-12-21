//servizio che esegue le richieste sulle diete

import UserInfo from "../user/infoModel.js";

export const saveDiet = async (userId, dietInfo) => {
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