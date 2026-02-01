import mongoose from "mongoose";

const UserAccountSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  ruolo: {
    type: String,
    enum: ["utente", "admin"],
    default: "utente"

  }
}, { versionKey: false });

const UserAccount = mongoose.model("AdminAccount", UserAccountSchema, "accounts");

export default UserAccount;
