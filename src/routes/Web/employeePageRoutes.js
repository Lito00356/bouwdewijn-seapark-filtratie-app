import { Router } from "express";
import { renderEmployeePage } from "../../controllers/Web/EmployeePageController.js";

const router = Router();

router.get("/", renderEmployeePage);
router.get("/tasks", renderEmployeePage);
router.get("/measurements", renderEmployeePage);
router.get("/notifications", renderEmployeePage);

export default router;
