//struttura degli utenti nel db

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
}, { versionKey: false }); 

const user = mongoose.model("user", userSchema);

export default user;
