//controller per raggiungere il servizio

import * as service from "./service.js";
import UserInfo from "./infoModel.js";


//login
export const logincontroller = async (req, res) => {
    var result = null;
    try {
        console.log(req.body);
        result = await service.loginUser(req.body);
        if (result.status) {
            res.send({
                "status": true,
                "message": result.message,
                "user": result.user,
                "hasProfileInfo": result.hasProfileInfo
            });
        } else {
            res.send({
                "status": false,
                "message": result.message
            });
        }
    } catch (err) {
        console.log(err);
    }
}

//salvataggio dei dati dell'utente del db
export const saveUserInfoController = async (req, res) => {
    try {
        const profileInfo = req.body;
        const result = await service.saveUserInfo(profileInfo);

        if (result.status) {
            res.send({
                status: true,
                message: "Profilo salvato con successo"
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
            message: "Errore nel salvataggio del profilo"
        });
    }
}

export const getUserInfoController = async (req, res) => {
  try {
    const userId = req.params.userId; //dal frontend

    const info = await getUserInfo(userId);

    if (!info) {
      return res.status(404).json({ message: "Info non trovate" });
    }

    res.json(info);
  } catch (err) {
    res.status(500).json({ message: "Errore server" });
  }
}

export const kcalCalculator = async (userId) => {
    try {
        const info = await getUserInfo(userId);

        if(info.obiettivo.equals("dimagrimento")){
            const bmr = BMR(info.peso, info.sesso, info.altezza, info.eta);
            const tdee = TDEE(bmr, info.livelloAttivitaFisica);

        }else if(info.obiettivo.equals("mantenimento")){
            

        }else if(info.obiettivo.equals("aumento_peso")){

        }
    }catch {

    }
}

