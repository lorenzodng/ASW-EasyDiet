import webpush from "web-push";
import Notification from "./infoModel.js";

// Save or update the user's notification subscription
export const saveSubscription = async ({ userId, subscription, notificationsEnabled }) => {
    try {
        const options = {
            upsert: true, // create the document if it does not exist
            new: true, // return the updated document
            setDefaultsOnInsert: true // apply default values on insert
        };

        const data = { notificationsEnabled };

        // If the user accepts notifications, save the subscription
        if (subscription) {
            data.subscription = subscription;
        }

        // Save or update the subscription
        const saved = await Notification.findOneAndUpdate(
            { userId },
            data,
            options
        );

        return { status: true, id: saved._id };
    } catch (err) {
        console.error("Errore nel service delle notifiche:", err);
        return { status: false, message: err.message };
    }
};

// Send a notification to the user
export const sendNotificationToUser = async (userId, payload) => {
    try {
        const subscriptionEntry = await Notification.findOne({ userId }); // Retrieve the user's notification subscription
        if (!subscriptionEntry)
            return { status: false, message: "Subscription non trovata" };
        // Send the notification to the browser
        await webpush.sendNotification(subscriptionEntry.subscription, JSON.stringify(payload)); 
        return { status: true };
    } catch (err) {
        console.error("Errore invio notifica all'utente:", err);
        return { status: false, message: err.message };
    }
};

// Check if the user has an active notification subscription
export const getStatusNotification = async (userId) => {
    try {
        let notification = await Notification.findOne({ userId });

        if (!notification) {
            // If it does not exist, return default values
            return {
                notificationsEnabled: false,
            };
        }

        return {
            notificationsEnabled: notification.notificationsEnabled,
        };
    } catch (err) {
        console.error('Errore service getStatusNotification:', err);
        throw err;
    }
};