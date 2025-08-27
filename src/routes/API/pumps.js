import { Router } from "express";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import {
  validateCreatePump,
  validateUpdatePump,
} from "../../middleware/validation/API/genericValidations.js";
import {
  index,
  show,
  store,
  update,
} from "../../controllers/API/PumpController.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post("/", validateCreatePump, handleAPIValidationErrors, store);
router.put("/:id", validateUpdatePump, handleAPIValidationErrors, update);

export default router;
