//servizio che esegue le richieste sulle diete

import DietInfo from "./infoModel.js";

//salva la dieta
export const saveDiet = async (dietData) => {
    try {
        const { userId, settimana } = dietData;

        let foundDiet = await DietInfo.findOne({ userId });

        if (foundDiet) { //se la dieta esiste già, la aggiorna
            foundDiet.settimana = settimana;
        } else {
            foundDiet = new DietInfo({ userId, settimana });
        }

        await foundDiet.save();
        return { status: true };
    } catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
};