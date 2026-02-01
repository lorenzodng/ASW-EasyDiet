import express from "express";
import usersRouter from "./usersRoutes.js";
import recipesRouter from "./recipesRoutes.js";
import { loginController } from "../../src/admin/controller.js";

const router = express.Router();

router.post("/login", loginController);
router.use("/users", usersRouter);
router.use("/recipes", recipesRouter);

export default router;
