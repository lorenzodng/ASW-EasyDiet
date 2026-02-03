// Dish structure for diets

import mongoose from "mongoose";

export const DietDishSchema = new mongoose.Schema({
    nome: {
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
    }]
}, { _id: false });