import "dotenv/config"; // Load environment variables from .env file
import express from "express";
import mongoose from "mongoose";
import webpush from "web-push";
import cors from "cors";
import usersRouter from "./route/usersRoutes.js";
import recipesRouter from "./route/recipesRoutes.js";
import dietsRouter from "./route/dietsRoutes.js";
import notificationsRouter from "./route/notificationRoutes.js";
import adminRouter from "./route/admin/index.js";
import { startMealReminders } from "./src/notification/scheduler.js";

const app = express();
const uri = process.env.MONGO_URI;

// Configure VAPID keys for push notifications
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
webpush.setVapidDetails(
  "mailto:easydiet@project.local", // Sender email (example)
  publicKey,
  privateKey
);

// Enable JSON parsing for incoming requests
app.use(express.json());

// Enable CORS between frontend (port 5173) and server (port 5000)
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Mount routers for different resources
app.use(usersRouter);
app.use(recipesRouter);
app.use(dietsRouter);
app.use(notificationsRouter);
app.use("/admin", adminRouter);

// Connect to MongoDB and start scheduled meal reminders
try {
  await mongoose.connect(uri);
  console.log("MongoDB connected");
  startMealReminders();
} catch (error) {
  console.error("MongoDB connection error:", error);
}

// Start the Express server
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
