import { Router } from "express";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import {
  validateCreateSubDepartment,
  validateUpdateSubDepartment,
} from "../../middleware/validation/API/genericValidations.js";
import {
  index,
  show,
  store,
  update,
} from "../../controllers/API/SubDepartmentController.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post("/", validateCreateSubDepartment, handleAPIValidationErrors, store);
router.put(
  "/:id",
  validateUpdateSubDepartment,
  handleAPIValidationErrors,
  update
);
export default router;
