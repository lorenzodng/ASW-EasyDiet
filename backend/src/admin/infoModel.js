import mongoose from "mongoose";

const AdminAccountSchema = new mongoose.Schema({
  nome: String,
  token: Number,
  ruolo: {
    type: String,
  }
}, { versionKey: false });

const AdminAccount = mongoose.model("AdminAccount", AdminAccountSchema, "accounts" );

export default AdminAccount;
