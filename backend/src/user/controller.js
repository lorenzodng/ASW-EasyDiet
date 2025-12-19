//controller per raggiungere il servizio

import * as service from "./service.js";

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
};

