//rotte notifiche

import express from "express"
import * as controller from "../src/notification/controller.js"

const router = express.Router()

router.get("/status-notification/:userId", controller.getStatusNotificationController) //verifica se esiste una sottoscrizione alle notifiche
router.post("/subscribe-notification/:userId", controller.saveSubscriptionController) //salva/aggiorna la sottoscrizione dell'utente alle notifiche

export default router
