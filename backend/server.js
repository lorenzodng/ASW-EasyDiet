//server

import 'dotenv/config'; //libreria che legge le variabili nel file .env
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./route/usersRoutes.js";
import recipesRouter from "./route/recipesRoutes.js";
import dietsRouter from "./route/dietsRoutes.js";

const uri = "mongodb+srv://easydiet:easydietpsw@dietdb.tfpxquz.mongodb.net/dietDb"; //url del db su mongodb atlas
const app = express();
const PORT = 5000;

app.use(express.json());

//abilita la comunicazione tra frontend (porta 5173) e server (porta 5000)
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(usersRouter);
app.use(recipesRouter);
app.use(dietsRouter);

//connette il server al db
try {
  await mongoose.connect(uri);
  console.log("MongoDB connected");
} catch (error) {
  console.error("MongoDB connection error:", error);
}

//avvia il server
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});