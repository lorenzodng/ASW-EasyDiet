import express from "express";
import usersRouter from "./usersRoutes.js";
import dishesRouter from "./dishesRoutes.js";
import { loginController } from "../../src/admin/controller.js";

const router = express.Router();

router.post("/login", loginController);
router.use("/users", usersRouter);
router.use("/dishes", dishesRouter);

export default router;
