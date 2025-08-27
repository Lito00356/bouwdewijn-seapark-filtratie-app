import { Router } from "express";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../../middleware/validation/API/validateUser.js";
import { handleAPIValidationErrors } from "../../middleware/validation/API/helpers/handleAPIValidationErrors.js";
import {
  index,
  show,
  store,
  update,
} from "../../controllers/API/UserController.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post("/", validateCreateUser, handleAPIValidationErrors, store);
router.put("/:id", validateUpdateUser, handleAPIValidationErrors, update);

export default router;
