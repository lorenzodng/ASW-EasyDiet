//rotte ricette

import express from "express"
import * as controller from "../src/recipes/controller.js";

const router = express.Router();

router.get('/recipes', controller.getRecipesController); //rotta per recuperare le ricette

export default router;
