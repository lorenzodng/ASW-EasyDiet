// struttura delle diete

import mongoose from "mongoose";

const DietSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "accounts",
            required: true,
            unique: true // una dieta attiva per utente
        },

        kcalUser: {
            type: Number,
            required: true
        },

        settimana: {
            Lunedì: {
                colazione: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                pranzo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                merenda: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes",
                    default: null
                },
                cena: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                }
            },

            Martedì: {
                colazione: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                pranzo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                merenda: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                cena: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                }
            },

            Mercoledì: {
                colazione: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                pranzo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                merenda: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                cena: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                }
            },

            Giovedì: {
                colazione: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                pranzo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                merenda: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                cena: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                }
            },

            Venerdì: {
                colazione: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                pranzo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                merenda: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                cena: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                }
            },

            Sabato: {
                colazione: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                pranzo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                merenda: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                cena: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                }
            },

            Domenica: {
                colazione: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                pranzo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                merenda: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
                },
                cena: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recipes"
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

const DietInfo = mongoose.model("diet", DietSchema);  //per collegarsi su mongoDB
export default DietInfo;
