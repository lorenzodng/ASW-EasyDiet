import express from "express";
import * as controller from "../../src/admin/user/controller.js";

const router = express.Router();

router.get("/", controller.getUsersController);
router.post("/", controller.createUserController);
router.put("/:id", controller.updateEmailUserController);
router.delete("/:id", controller.deleteUserController);
router.get("/:id/info", controller.getUserInfoController);
router.get('/info', controller.getUsersWithDietController);

export default router;
