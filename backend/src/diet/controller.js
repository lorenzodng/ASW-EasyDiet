//controller che gestisce le richieste sulle diete

import * as service from "./service.js";


//salvataggio della dieta
export const saveDietController = async (req, res) => {
    try {
        const dietData = req.body;
        const result = await service.saveDiet(dietData);

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

//recupero della dieta dell'utente
export const getDietInfoController = async (req, res) => {
    try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "UserId mancante"
      });
    }

    const diet = await DietInfo.findOne({ userId });

    if (!diet) {
      return res.status(404).json({
        status: false,
        message: "Nessuna dieta trovata per questo utente"
      });
    }

    return res.status(200).json({
      status: true,
      data: diet
    });

  } catch (error) {
    console.error("Errore recupero dieta:", error);
    return res.status(500).json({
      status: false,
      message: "Errore server nel recupero della dieta"
    });
  }   
};

