//struttura delle ricette

import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        enum: ["colazione", "pranzo", "merenda", "cena"],
        required: true
    },
    immagine:{
        type: String,
        required: true
    },
    ingredienti: [{
        nome: {
            type: String,
            required: true
        },
        peso: {
            type: Number,
            required: true
        },
        kcal: {
            type: Number,
            required: true
        }
    }],
    kcal: {
        type: Number,
        required: true
    },
    info: [{
        descrizioneKcal: String,
        descrizioneTipoDieta: String,
        descrizioneIntolleranze: String
    }]
}, { versionKey: false });

const RecipeInfo = mongoose.model("recipes", RecipeSchema);

export default RecipeInfo;
