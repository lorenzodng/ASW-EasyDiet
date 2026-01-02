//struttura delle notifiche

import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
        unique: true
    },

    subscription: {
        type: Object,
        required: false
    },

    //per sapere se il banner deve comparire
    notificationsBanner: {
        type: Boolean,
        default: true
    },

    //per sapere se l'utente ha attivato le notifiche
    notificationsEnabled: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("Notification", subscriptionSchema)