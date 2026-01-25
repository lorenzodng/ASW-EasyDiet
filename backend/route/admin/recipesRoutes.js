//rotte admin pasti 

import express from "express"
import * as controller from "../../src/admin/controller.js";

const router = express.Router();

router.post("/", controller.createRecipeController);      //rotta per creare le ricette
router.delete("/:id", controller.deleteRecipeController);     //rotta per eliminare le ricette
router.put("/:id", controller.updateRecipeController);  //rotta per modificare una ricetta

export default router;
