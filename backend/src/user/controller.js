//controller che gestisce le richieste sull'utente

import * as service from "./service.js";

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
                "hasProfileInfo": result.hasProfileInfo,
                "token": result.token
            });
        } else {
            res.send({
                "status": false,
                "message": result.message
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: 'Server error' });
    }
};

//salvataggio dei dati dell'utente
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
};

//recupero delle informazioni del'utente
export const getUserProfileInfoController = async (req, res) => {
    try {
        const userId = req.params.userId;

        const info = await service.getUserProfileInfo(userId);

        if (!info) {
            return res.status(404).json({ message: "Info non trovate" });
        }

        res.json(info);
    } catch (err) {
        res.status(500).json({ message: "Errore server" });
    }
};

//notifica l'utente sull'aggiornamento del peso
export const notifyWeightController = async (req, res) => {
    const { userId, nuovoPeso } = req.body;
    try {
        const result = await service.notifyWeight(userId, nuovoPeso);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Errore server" });
    }
};

//recupera l'id e il nome tramite il token jwt
export const getUserIdNameController = async (req, res) => {
    try {
        const userId = req.user.id; //recupera l'id e il nome che arriva dal middleware
        const userData = await service.getUserIdName(userId);
        res.json(userData);
    } catch (err) {
        console.error('Errore getUserController:', err);
        res.status(500).json({ message: 'Errore server' });
    }
};



