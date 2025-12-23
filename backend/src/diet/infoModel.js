import mongoose from "mongoose";
import mongoose from "mongoose";
import { RecipeSchema } from "../recipes/infoModel.js";


const DietSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
      unique: true
    },

    kcalUser: {
      type: Number,
      required: true
    },

    settimana: {
      Lunedì: {
        colazione: RecipeSchema,
        pranzo: RecipeSchema,
        merenda: RecipeSchema,
        cena: RecipeSchema
      },
      Martedì: {
        colazione: RecipeSchema,
        pranzo: RecipeSchema,
        merenda: RecipeSchema,
        cena: RecipeSchema
      },
      Mercoledì: {
        colazione: RecipeSchema,
        pranzo: RecipeSchema,
        merenda: RecipeSchema,
        cena: RecipeSchema
      },
      Giovedì: {
        colazione: RecipeSchema,
        pranzo: RecipeSchema,
        merenda: RecipeSchema,
        cena: RecipeSchema
      },
      Venerdì: {
        colazione: RecipeSchema,
        pranzo: RecipeSchema,
        merenda: RecipeSchema,
        cena: RecipeSchema
      },
      Sabato: {
        colazione: RecipeSchema,
        pranzo: RecipeSchema,
        merenda: RecipeSchema,
        cena: RecipeSchema
      },
      Domenica: {
        colazione: RecipeSchema,
        pranzo: RecipeSchema,
        merenda: RecipeSchema,
        cena: RecipeSchema
      }
    },

    dataCreazione: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);

const DietInfo = mongoose.model("diet", DietSchema);
export default DietInfo;
