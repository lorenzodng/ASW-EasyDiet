//rotte

import express from "express"
import * as controller from "../src/user/controller.js";

const router = express.Router();

router.post('/login', controller.logincontroller); //rotta di login
router.post('/user/setup', controller.saveUserInfoController); //rotta del form

export default router;


