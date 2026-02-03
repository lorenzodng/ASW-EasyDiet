import * as service from "./service.js";

/*
  Controller layer:
  Handles HTTP requests and delegates user-related logic to the service layer.
*/

// User authentication
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

// Save profile information for a single user
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

// Get profile information for a single user
export const getUserProfileInfoController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const info = await service.getUserProfileInfo(userId);
        if (!info) {
            return res.status(404).json({ message: "Informazioni utente non trovate" });
        }
        res.json(info);
    } catch (err) {
        res.status(500).json({ message: "Errore server" });
    }
};

// Get the user ID and name
export const getUserIdNameController = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from the JWT middleware
        const userData = await service.getUserIdName(userId);
        res.json(userData);
    } catch (err) {
        console.error('Errore getUserController:', err);
        res.status(500).json({ message: 'Errore server' });
    }
};



