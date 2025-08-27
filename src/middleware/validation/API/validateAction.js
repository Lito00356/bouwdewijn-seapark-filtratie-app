import { body, param } from "express-validator";
import Action from "../../../models/Action.js";
import checkEntityExists from "./helpers/checkEntityExists.js";
import checkFieldUniqueness from "./helpers/checkFieldUniqueness.js";

const validateActionData = (isUpdate = false) => [
  param("id")
    .if(() => isUpdate)
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .custom(checkEntityExists(Action, "Action")),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name required.")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .bail(),
  body("object_type")
    .trim()
    .notEmpty()
    .withMessage("Object type is required.")
    .bail()
    .isIn(["filter", "pump", "department", "sub_department"])
    .withMessage(
      "Invalid value for 'object_type'. Allowed values are: filter, pump, department, sub_department"
    ),
  body("frequency")
    .trim()
    .notEmpty()
    .withMessage("Frequency is required.")
    .bail()
    .isIn(["daily", "weekly", "monthly", "as_needed"])
    .withMessage(
      "Invalid value for 'frequency'. Allowed values are: daily, weekly, monthly, as_needed"
    ),
  body("is_active")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Status must be either Active or Inactive")
    .bail()
    .toInt(),
];

export const validateCreateAction = validateActionData(false);
export const validateUpdateAction = validateActionData(true);
