//rotte notifiche

import express from "express"
import * as controller from "../src/notification/controller.js"

const router = express.Router()

router.get("/status-notification/:userId", controller.getStatusNotificationController) //verifica se esiste una sottoscrizione alle notifiche
router.post("/subscribe-notification", controller.saveSubscriptionController) //salva la sottoscrizione dell'utente alle notifiche
router.post("/status-notification/:userId", controller.setStatusNotificationController) //aggiorna il documento delle notifiche

export default router
