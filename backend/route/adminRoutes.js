//rotte admin

import express from "express"
import * as controller from "../src/admin/controller.js";

const router = express.Router();

console.log("ADMIN ROUTES CARICATE");

router.post('/admin/login', controller.adminController); //rotta di login

export default router;


