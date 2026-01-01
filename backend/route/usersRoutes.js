//rotte utenti

import express from "express"
import * as controller from "../src/user/controller.js";
import * as middleware from '../src/user/middleware.js';

const router = express.Router();

router.post('/login', controller.loginController); //rotta di login
router.post('/users/:userId/profile', controller.saveUserProfileInfoController); //rotta per creare il profilo dal form
router.get('/users/:userId/profile', controller.getUserProfileInfoController); //rotta per visualizzare le informazioni del profilo
router.post('/users/:userId/update-weight', controller.updateWeightController); //rotta per aggiornare il peso dell'utente
router.get('/users/user', middleware.authMiddleware, controller.getUserIdNameController); //rotta per recuperare l'id dell'utente tramite token jwt

export default router;


