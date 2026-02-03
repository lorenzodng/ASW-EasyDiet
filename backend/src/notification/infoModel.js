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

    notificationsEnabled: {
        type: Boolean,
        default: false
    }
});

const Notification = mongoose.model("Notification", subscriptionSchema)
export default Notification;