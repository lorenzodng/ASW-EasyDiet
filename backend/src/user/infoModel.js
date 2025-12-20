import mongoose from "mongoose";

const InfoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "accounts", required: true },
    eta: { type: Number, required: true },
    peso: { type: Number, required: true },
    sesso: { type: String, enum: ["maschio", "femmina"], required: true },
    altezza: { type: Number, required: true },
    obiettivo: { type: String, enum: ["dimagrimento", "mantenimento", "aumento_peso"], required: true },
    livelloAttivitaFisica: { type: String, enum: ["basso", "moderato", "intenso"], required: true },
    kcal:{type:Number}
}, { versionKey: false });

const UserInfo = mongoose.model("users", InfoSchema);

export default UserInfo;