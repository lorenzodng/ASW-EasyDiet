import express from "express";
import * as controller from "../../src/admin/dish/controller.js";

const router = express.Router();

router.post("/", controller.createDishController);
router.delete("/:id", controller.deleteDishController);
router.put("/:id", controller.updateDishController);

export default router;
