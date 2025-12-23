//struttura delle diete

import mongoose from "mongoose";
import { DietRecipeSchema } from "../recipes/liteInfoModel.js";

const DietSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
      unique: true
    },

    settimana: {
      lunedì: {
        colazione: DietRecipeSchema,
        pranzo: DietRecipeSchema,
        merenda: DietRecipeSchema,
        cena: DietRecipeSchema
      },
      martedì: {
        colazione: DietRecipeSchema,
        pranzo: DietRecipeSchema,
        merenda: DietRecipeSchema,
        cena: DietRecipeSchema
      },
      mercoledì: {
        colazione: DietRecipeSchema,
        pranzo: DietRecipeSchema,
        merenda: DietRecipeSchema,
        cena: DietRecipeSchema
      },
      giovedì: {
        colazione: DietRecipeSchema,
        pranzo: DietRecipeSchema,
        merenda: DietRecipeSchema,
        cena: DietRecipeSchema
      },
      venerdì: {
        colazione: DietRecipeSchema,
        pranzo: DietRecipeSchema,
        merenda: DietRecipeSchema,
        cena: DietRecipeSchema
      },
      sabato: {
        colazione: DietRecipeSchema,
        pranzo: DietRecipeSchema,
        merenda: DietRecipeSchema,
        cena: DietRecipeSchema
      },
      domenica: {
        colazione: DietRecipeSchema,
        pranzo: DietRecipeSchema,
        merenda: DietRecipeSchema,
        cena: DietRecipeSchema
      }
    },

    dataCreazione: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);

const DietInfo = mongoose.model("diets", DietSchema);
export default DietInfo;
