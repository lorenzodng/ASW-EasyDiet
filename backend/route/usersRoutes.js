import express from "express";
import * as controller from "../src/user/controller.js";
import * as middleware from '../src/user/middleware.js';

const router = express.Router();

router.get("/users/:userId/profile", controller.getUserProfileInfoController);
router.get("/users/user", middleware.authMiddleware, controller.getUserIdNameController); // Get the authenticated user's id and name using JWT
router.post("/login", controller.loginController);
router.post("/users/:userId/profile", controller.saveUserProfileInfoController);
router.post("/users/:userId/update-weight", controller.notifyWeightController);

export default router;


