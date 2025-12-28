//rotte diete

import express from "express"
import * as controller from "../src/diet/controller.js";

const router = express.Router();

router.post('/diets', controller.saveDietController); //rotta per salvare le diete
router.get('/diets/:userId', controller.getDietInfoController);//rotta per visualizzare la dieta
router.get('/chat', controller.chatController); //rotta per chattare con LLM

export default router;
