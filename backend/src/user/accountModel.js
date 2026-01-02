//struttura dell'account utente

import mongoose from "mongoose";

const UserAccountSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  ruolo: {
    type: String
  }
}, { versionKey: false });

const UserAccount = mongoose.model("Account", UserAccountSchema, "accounts");

export default UserAccount;
