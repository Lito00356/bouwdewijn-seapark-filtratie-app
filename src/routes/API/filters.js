import { Router } from "express";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import {
  validateCreateFilter,
  validateUpdateFilter,
} from "../../middleware/validation/API/genericValidations.js";
import {
  index,
  show,
  store,
  update,
} from "../../controllers/API/FilterController.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post("/", validateCreateFilter, handleAPIValidationErrors, store);
router.put("/:id", validateUpdateFilter, handleAPIValidationErrors, update);

export default router;
