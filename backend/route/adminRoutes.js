//rotte admin

import express from "express"
import * as controller from "../src/admin/controller.js";

const router = express.Router();

router.post('/admin/login', controller.adminController); //rotta di login
//user
router.get('/admin/users', controller.getUsersController); //rotta per recuperare gli utenti
router.post('/admin/users', controller.createUserController); //rotta per creare un nuovo utente 
router.put("/admin/users/:id", controller.updateemailUserController); //rotta per modificare la mail 
router.delete("/admin/users/:id", controller.deleteUserController); //eliminare l'utente 
router.get("/admin/users/:id/info", controller.getUserInfoController); //per recuperare le informazioni personali 
router.get('/admin/users/info', controller.getUsersInfoController); //rotta per recuperare le informazioni degli utenti

//recipe 
router.post("/admin/recipes", controller.createRecipeController); //rotta per creare le ricette
router.delete("/recipes/:id", controller.deleteRecipeController); //rotta per eliminare le ricette
router.put("/recipes/:id", controller.updateRecipeController); //rotta per modificare una ricetta 

//diet
router.post("/admin/diet", controller.createDietController); //rotta per creare le diete
router.delete("/diet/user/:userId", controller.deleteDietController);  //rotta per eliminare le diete
router.put("/diet/:id", controller.updateDietController);  //rotta per modificare una diete

export default router;


