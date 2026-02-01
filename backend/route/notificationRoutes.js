import express from "express";
import * as controller from "../src/notification/controller.js";

const router = express.Router();

router.get("/status-notification/:userId", controller.getStatusNotificationController); // Check user notification subscription status
router.post("/subscribe-notification/:userId", controller.saveSubscriptionController); // Create or update user notification subscription

export default router;
