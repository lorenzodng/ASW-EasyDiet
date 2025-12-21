//struttura dell'account utente

import mongoose from "mongoose";

const UserAccountSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
}, { versionKey: false });

const UserAccount = mongoose.model("accounts", UserAccountSchema);

export default UserAccount;
