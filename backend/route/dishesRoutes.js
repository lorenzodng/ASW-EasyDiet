import express from "express";
import * as controller from "../src/dishes/controller.js";

const router = express.Router();

router.get("/dishes", controller.getDishesController);

export default router;
