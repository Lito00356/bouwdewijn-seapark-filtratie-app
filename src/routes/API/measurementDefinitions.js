import { Router } from "express";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import {
  validateCreateMeasurementDefinition,
  validateUpdateMeasurementDefinition,
} from "../../middleware/validation/API/validateMeasurementDefinition.js";
import {
  index,
  show,
  store,
  update,
} from "../../controllers/API/MeasurementDefinitionController.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post(
  "/",
  validateCreateMeasurementDefinition,
  handleAPIValidationErrors,
  store
);
router.put(
  "/:id",
  validateUpdateMeasurementDefinition,
  handleAPIValidationErrors,
  update
);

export default router;
