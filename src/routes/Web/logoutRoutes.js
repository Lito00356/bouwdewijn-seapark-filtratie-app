import { Router } from "express";
import { logout } from "../../controllers/Web/LogoutController.js";

const router = Router();

router.get("/", logout);

export default router;
