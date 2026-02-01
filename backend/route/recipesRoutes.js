import express from "express";
import * as controller from "../src/recipes/controller.js";

const router = express.Router();

router.get("/recipes", controller.getRecipesController);

export default router;
