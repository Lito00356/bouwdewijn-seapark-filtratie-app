import { Router } from "express";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import { validateCreateTaskLog } from "../../middleware/validation/API/validateCreateTaskLog.js";
import { validateUpdateTaskLog } from "../../middleware/validation/API/validateUpdateTaskLog.js";
import {
  index,
  show,
  store,
  update,
  destroy,
  recent,
} from "../../controllers/API/TaskLogController.js";

const router = Router();

router.get("/", index);
router.get("/recent", recent);
router.get("/:id", show);
router.post("/", validateCreateTaskLog, handleAPIValidationErrors, store);
router.put("/:id", validateUpdateTaskLog, handleAPIValidationErrors, update);
router.delete("/:id", destroy);

export default router;
