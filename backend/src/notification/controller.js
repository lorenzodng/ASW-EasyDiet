import * as service from "./service.js";

// Save or update user notification subscription
export const saveSubscriptionController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { subscription, notificationsEnabled } = req.body;

        const result = await service.saveSubscription({ userId, subscription, notificationsEnabled });

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

// Check if the user has an active notification subscription
export const getStatusNotificationController = async (req, res) => {
    const { userId } = req.params
    try {
        const status = await service.getStatusNotification(userId);
        res.json(status);
    } catch (err) {
        console.error('Errore controller:', err)
        res.status(500).json({ error: "Errore server" })
    }
};