//struttura delle ricette

import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    categoria: { type: String, enum: ["colazione", "pranzo", "merenda", "cena"], required: true },
    ingredienti: [{ nome: { type: String, required: true }, peso: { type: Number, required: true }, kcal: { type: Number, required: true } }],
    kcal: { type: Number, required: true },
    info: { type: String, type: String, type: String }
}, { versionKey: false });

const RecipeInfo = mongoose.model("recipes", RecipeSchema);

export default RecipeInfo;
