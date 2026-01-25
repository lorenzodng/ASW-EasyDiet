//rotte admin utenti 

import express from "express"
import * as controller from "../../src/admin/controller.js";

const router = express.Router();

router.get("/", controller.getUsersController); //rotta per recuperare gli utenti
router.post("/", controller.createUserController); //rotta per creare un nuovo utente 
router.put("/:id", controller.updateemailUserController); //rotta per modificare la mail 
router.delete("/:id", controller.deleteUserController); //eliminare l'utente 
router.get("/:id/info", controller.getUserInfoController); //per recuperare le informazioni personali 
router.get('/info', controller.getUsersInfoController); //rotta per recuperare le informazioni degli utenti

export default router;
