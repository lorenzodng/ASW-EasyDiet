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
        required: true
    }
})

export default mongoose.model("Notification", subscriptionSchema)
