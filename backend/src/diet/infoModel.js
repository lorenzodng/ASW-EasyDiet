import mongoose from "mongoose";
import { DietDishSchema } from "../dishes/liteInfoModel.js";

const DietSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true
    },

    settimana: {
      lunedì: {
        colazione: {
          dish: DietDishSchema,
          time: String
        },
        pranzo: {
          dish: DietDishSchema,
          time: String
        },
        merenda: {
          dish: DietDishSchema,
          time: String
        },
        cena: {
          dish: DietDishSchema,
          time: String
        }
      },

      martedì: {
        colazione: {
          dish: DietDishSchema,
          time: String
        },
        pranzo: {
          dish: DietDishSchema,
          time: String
        },
        merenda: {
          dish: DietDishSchema,
          time: String
        },
        cena: {
          dish: DietDishSchema,
          time: String
        }
      },

      mercoledì: {
        colazione: {
          dish: DietDishSchema,
          time: String
        },
        pranzo: {
          dish: DietDishSchema,
          time: String
        },
        merenda: {
          dish: DietDishSchema,
          time: String
        },
        cena: {
          dish: DietDishSchema,
          time: String
        }
      },

      giovedì: {
        colazione: {
          dish: DietDishSchema,
          time: String
        },
        pranzo: {
          dish: DietDishSchema,
          time: String
        },
        merenda: {
          dish: DietDishSchema,
          time: String
        },
        cena: {
          dish: DietDishSchema,
          time: String
        }
      },

      venerdì: {
        colazione: {
          dish: DietDishSchema,
          time: String
        },
        pranzo: {
          dish: DietDishSchema,
          time: String
        },
        merenda: {
          dish: DietDishSchema,
          time: String
        },
        cena: {
          dish: DietDishSchema,
          time: String
        }
      },

      sabato: {
        colazione: {
          dish: DietDishSchema,
          time: String
        },
        pranzo: {
          dish: DietDishSchema,
          time: String
        },
        merenda: {
          dish: DietDishSchema,
          time: String
        },
        cena: {
          dish: DietDishSchema,
          time: String
        }
      },

      domenica: {
        colazione: {
          dish: DietDishSchema,
          time: String
        },
        pranzo: {
          dish: DietDishSchema,
          time: String
        },
        merenda: {
          dish: DietDishSchema,
          time: String
        },
        cena: {
          dish: DietDishSchema,
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

const DietInfo = mongoose.model("Diet", DietSchema);
export default DietInfo;
