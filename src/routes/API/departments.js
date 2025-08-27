import { Router } from "express";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import {
  index,
  show,
  store,
  update,
} from "../../controllers/API/DepartmentController.js";
import {
  validateCreateDepartment,
  validateUpdateDepartment,
} from "../../middleware/validation/API/validateDepartment.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post("/", validateCreateDepartment, handleAPIValidationErrors, store);
router.put("/:id", validateUpdateDepartment, handleAPIValidationErrors, update);

export default router;
