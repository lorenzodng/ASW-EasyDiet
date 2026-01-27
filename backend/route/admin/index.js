import express from "express";
import usersRouter from "./usersRoutes.js";
import recipesRouter from "./recipesRoutes.js";
import { adminController } from "../../src/admin/controller.js";

const router = express.Router();
router.post("/login", adminController);

router.use("/users", usersRouter);
router.use("/recipes", recipesRouter);

export default router;
