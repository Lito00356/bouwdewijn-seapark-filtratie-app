import { Router } from "express";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../../controllers/API/MeasurementLogController.js";
import {
  validateCreateMeasurementLog,
  validateUpdateMeasurementLog,
} from "../../middleware/validation/API/validateMeasurementLog.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post(
  "/",
  validateCreateMeasurementLog,
  handleAPIValidationErrors,
  store
);
router.put(
  "/:id",
  validateUpdateMeasurementLog,
  handleAPIValidationErrors,
  update
);
router.delete("/:id", destroy);

export default router;
