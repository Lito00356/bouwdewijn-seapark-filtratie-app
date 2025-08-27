import { Router } from "express";
import {
  validateCreateAction,
  validateUpdateAction,
} from "../../middleware/validation/API/validateAction.js";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import {
  index,
  show,
  store,
  update,
} from "../../controllers/API/ActionController.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post("/", validateCreateAction, handleAPIValidationErrors, store);
router.put("/:id", validateUpdateAction, handleAPIValidationErrors, update);

export default router;
