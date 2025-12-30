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
        colazione: {
          recipe: DietRecipeSchema,
          time: String
        },
        pranzo: {
          recipe: DietRecipeSchema,
          time: String
        },
        merenda: {
          recipe: DietRecipeSchema,
          time: String
        },
        cena: {
          recipe: DietRecipeSchema,
          time: String
        }
      },

      martedì: {
        colazione: {
          recipe: DietRecipeSchema,
          time: String
        },
        pranzo: {
          recipe: DietRecipeSchema,
          time: String
        },
        merenda: {
          recipe: DietRecipeSchema,
          time: String
        },
        cena: {
          recipe: DietRecipeSchema,
          time: String
        }
      },

      mercoledì: {
        colazione: {
          recipe: DietRecipeSchema,
          time: String
        },
        pranzo: {
          recipe: DietRecipeSchema,
          time: String
        },
        merenda: {
          recipe: DietRecipeSchema,
          time: String
        },
        cena: {
          recipe: DietRecipeSchema,
          time: String
        }
      },

      giovedì: {
        colazione: {
          recipe: DietRecipeSchema,
          time: String
        },
        pranzo: {
          recipe: DietRecipeSchema,
          time: String
        },
        merenda: {
          recipe: DietRecipeSchema,
          time: String
        },
        cena: {
          recipe: DietRecipeSchema,
          time: String
        }
      },

      venerdì: {
        colazione: {
          recipe: DietRecipeSchema,
          time: String
        },
        pranzo: {
          recipe: DietRecipeSchema,
          time: String
        },
        merenda: {
          recipe: DietRecipeSchema,
          time: String
        },
        cena: {
          recipe: DietRecipeSchema,
          time: String
        }
      },

      sabato: {
        colazione: {
          recipe: DietRecipeSchema,
          time: String
        },
        pranzo: {
          recipe: DietRecipeSchema,
          time: String
        },
        merenda: {
          recipe: DietRecipeSchema,
          time: String
        },
        cena: {
          recipe: DietRecipeSchema,
          time: String
        }
      },

      domenica: {
        colazione: {
          recipe: DietRecipeSchema,
          time: String
        },
        pranzo: {
          recipe: DietRecipeSchema,
          time: String
        },
        merenda: {
          recipe: DietRecipeSchema,
          time: String
        },
        cena: {
          recipe: DietRecipeSchema,
          time: String
        }
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
