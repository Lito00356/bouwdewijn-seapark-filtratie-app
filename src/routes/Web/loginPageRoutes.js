import { Router } from "express";
import {authenticateLogin, login } from "../../controllers/Web/LoginPageController.js";
import validateLogin from "../../middleware/validation/Web/validateLogin.js";

const router = Router();

router.get("/", login);
router.post("/", validateLogin, authenticateLogin, login);

export default router;
