//rotte diete

import express from "express"
import * as controller from "../src/diet/controller.js";

const router = express.Router();

router.post('/diets', controller.saveDietController); //rotta per salvare le diete

export default router;
