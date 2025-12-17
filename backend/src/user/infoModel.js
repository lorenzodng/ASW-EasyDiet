import mongoose from "mongoose";

const InfoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "accounts", required: true },
    peso: { type: Number, required: true },
    altezza: { type: Number, required: true },
    eta: { type: Number, required: true },
    sesso: { type: String, enum: ["m", "f", "n.s."], required: true },
    attivitaFisica: { type: String, enum: ["nessuna", "bassa", "media", "elevata"], required: true },
    obiettivo: { type: String, enum: ["dimagrire", "mantenere", "aumentare"], required: true },
}, { versionKey: false });

const UserInfo = mongoose.model("users", InfoSchema);

export default UserInfo;