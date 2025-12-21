//controller che gestisce le richieste sulle diete

import * as service from "./service.js";

//salvataggio della dieta
export const saveDietController = async (req, res) => {
    try {
        const userId = req.body;
        const result = await service.saveDiet(userId, dietInfo);

        if (result.status) {
            res.send({
                status: true,
                message: "Dieta salvata con successo"
            });
        } else {
            res.send({
                status: false,
                message: result.message
            });
        }
    } catch (err) {
        console.error(err);
        res.send({
            status: false,
            message: "Errore nel salvataggio della dieta"
        });
    }
};