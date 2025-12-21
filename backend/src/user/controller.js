//controller per raggiungere il servizio

import * as service from "./service.js";
import UserInfo from "./infoModel.js";
import AccountInfo from "./accountModel.js";

//login
export const loginController = async (req, res) => {
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
export const saveUserProfileInfoController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const profileInfo = req.body;
        const result = await service.saveUserProfileInfo(userId, profileInfo);

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

export const getUserProfileInfoController = async (req, res) => {
    try {
        const userId = req.params.userId;

        const info = await UserInfo.findOne({ userId });

        if (!info) {
            return res.status(404).json({ message: "Info non trovate" });
        }

        res.json(info);
    } catch (err) {
        res.status(500).json({ message: "Errore server" });
    }
}
