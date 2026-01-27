import express from "express"
import * as controller from "../src/diet/controller.js";

const router = express.Router();

router.post('/diets', controller.saveDietController); 
router.get('/diets/:userId', controller.getDietInfoController); 
router.delete('/diets/:userId', controller.deleteDietInfoController); 
router.get('/chat', controller.chatController); // Chat with LLM

export default router;
