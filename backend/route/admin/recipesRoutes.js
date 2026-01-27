import express from "express"
import * as controller from "../../src/admin/controller.js";

const router = express.Router();

router.post("/", controller.createRecipeController);      
router.delete("/:id", controller.deleteRecipeController);    
router.put("/:id", controller.updateRecipeController);  

export default router;
