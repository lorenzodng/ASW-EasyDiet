//rotte notifiche

import express from "express"
import * as controller from "../src/notification/controller.js"

const router = express.Router()

router.post("/subscribe-notification", controller.saveSubscriptionController) //salva la sottoscrizione dell'utente alle notifiche

export default router
