//rotte utenti

import express from "express"
import * as controller from "../src/user/controller.js";

const router = express.Router();

router.post('/login', controller.loginController); //rotta di login
router.post('/users/:userId/profile', controller.saveUserProfileInfoController); //rotta per creare il profilo dal form
router.get('/users/:userId/profile', controller.getUserProfileInfoController); //rotta per visualizzare le informazioni del profilo

export default router;


