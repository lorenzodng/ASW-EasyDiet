//struttura degli utenti nel db

import mongoose from "mongoose";

const UserAccountSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}, { versionKey: false });

const UserAccount = mongoose.model("accounts", UserAccountSchema);

export default UserAccount;
