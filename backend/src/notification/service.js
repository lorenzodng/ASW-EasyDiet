//servizio delle notifiche 

import webpush from "web-push";
import NotificationSubscription from "./infoModel.js";

//salva la sottoscrizione dell'utente alle notifiche
export const saveSubscription = async ({ userId, subscription }) => {
    try {
        const saved = await NotificationSubscription.create({
            userId,
            subscription
        });

        return { status: true, id: saved._id };
    } catch (err) {
        console.error("Errore nel service delle notifiche:", err);
        return { status: false, message: err.message };
    }
};

//invia una notifica all'utente
export const sendNotificationToUser = async (userId, payload) => {
    try {
        const subscriptionEntry = await NotificationSubscription.findOne({ userId }); //recupera il documento di sottoscrizione alle notifiche
        if (!subscriptionEntry)
            return { status: false, message: "Subscription non trovata" };

        await webpush.sendNotification(subscriptionEntry.subscription, JSON.stringify(payload)); //invia la notifica al browser
        return { status: true };
    } catch (err) {
        console.error("Errore invio notifica all'utente:", err);
        return { status: false, message: err.message };
    }
};
