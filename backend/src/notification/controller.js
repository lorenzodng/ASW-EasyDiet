//controller per le notifiche

import * as service from "./service.js";

//salva la sottoscrizione dell'utente alle notifiche
export const saveSubscriptionController = async (req, res) => {
    try {
        const subscriptionData = req.body;

        const result = await service.saveSubscription(subscriptionData);

        if (result.status) {
            res.status(201).json({
                status: true,
                message: "Subscription salvata con successo",
                id: result.id
            });
        } else {
            res.status(400).json({
                status: false,
                message: result.message
            });
        }
    } catch (err) {
        console.error("Errore nel controller delle notifiche:", err);
        res.status(500).json({
            status: false,
            message: "Errore server"
        });
    }
};

//verifica l'eseistenza di una sottoscrizione dell'utente alle notifiche
export const getStatusNotificationController = async (req, res) => {
    const { userId } = req.params
    try {
        const isEnabled = await service.getStatusNotification(userId)
        res.json({ notificationsEnabled: isEnabled })
    } catch (err) {
        console.error('Errore controller:', err)
        res.status(500).json({ error: "Errore server" })
    }
}