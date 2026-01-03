//rotte admin

import express from "express"
import * as controller from "../src/admin/controller.js";

const router = express.Router();

console.log("ADMIN ROUTES CARICATE");

router.post('/admin/login', controller.adminController); //rotta di login
router.get('/admin/users', controller.getUsersController); //rotta per rcuperare gli utenti
router.post('/admin/users', controller.createUserController); //rotta per creare un nuovo utente 
router.put("/admin/users/:id", controller.updateemailUserController); //rotta per modificare la mail 
router.delete("/admin/users/:id", controller.deleteUserController);//eliminare l'utente 
router.get("/admin/users/:id/info", controller.getUserInfoController); //per recuperare le informazioni personali 


export default router;


