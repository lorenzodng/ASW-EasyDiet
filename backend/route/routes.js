//rotte

import express from "express"
import * as userController from "../src/user/userController.js";

const router = express.Router(); 

router.post('/login', userController.loginUserController); //rotta di login

export default router; 


