//servizio delle notifiche 

import webpush from "web-push";
import Notification from "./infoModel.js";

//salva la sottoscrizione dell'utente alle notifiche
export const saveSubscription = async ({ userId, subscription }) => {
    try {

        const options = {
            upsert: true, //se non esiste un documento, lo crea
            new: true, //aggiorna il documento e lo restituisce (in saved)
            setDefaultsOnInsert: true //applica i valori di default alla creazione del documento
        };

        const saved = await Notification.findOneAndUpdate(
            { userId },
            { subscription },
            options
        );
        return { status: true, id: saved._id };
    } catch (err) {
        console.error("Errore nel service delle notifiche:", err);
        return { status: false, message: err.message };
    }
};

//invia una notifica all'utente
export const sendNotificationToUser = async (userId, payload) => {
    try {
        const subscriptionEntry = await Notification.findOne({ userId }); //recupera il documento di sottoscrizione alle notifiche
        if (!subscriptionEntry)
            return { status: false, message: "Subscription non trovata" };

        await webpush.sendNotification(subscriptionEntry.subscription, JSON.stringify(payload)); //invia la notifica al browser
        return { status: true };
    } catch (err) {
        console.error("Errore invio notifica all'utente:", err);
        return { status: false, message: err.message };
    }
};

//verifica l'eseistenza di una sottoscrizione dell'utente alle notifiche
export const getStatusNotification = async (userId) => {
    try {
        let notification = await Notification.findOne({ userId });

        if (!notification) {
            //se non esiste, restituisce valori di default
            return {
                notificationsEnabled: false,
                notificationsBanner: true
            };
        }

        return {
            notificationsEnabled: notification.notificationsEnabled,
            notificationsBanner: notification.notificationsBanner
        };
    } catch (err) {
        console.error('Errore service getStatusNotification:', err);
        throw err;
    }
};
//aggiorna il documento delle notifiche
export const setStatusNotification = async (userId, updates) => {
    let notification = await Notification.findOne({ userId });

    if (notification) {   // aggiorna i campi forniti
        Object.keys(updates).forEach(key => { notification[key] = updates[key] });
        await notification.save();
    } else {  // crea un nuovo documento
        notification = new Notification({
            userId,
            ...updates
        });
        await notification.save();
    }

    return notification;
};