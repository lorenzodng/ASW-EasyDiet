//struttura delle notifiche

import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    subscription: {
        type: Object,
        required: true
    }
})

export default mongoose.model("notification_subscription", subscriptionSchema)
