import { body, param } from "express-validator";
import Department from "../../../models/Department.js";
import checkEntityExists from "./helpers/checkEntityExists.js";
import checkFieldUniqueness from "./helpers/checkFieldUniqueness.js";

const validateDepartmentData = (isUpdate = false) => [
  param("id")
    .if(() => isUpdate)
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .custom(checkEntityExists(Department, "Department")),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .bail()
    .custom(checkFieldUniqueness(Department, "name", isUpdate)),
  body("is_active")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Status must be either Active or Inactive")
    .bail()
    .toInt(),
];

export const validateCreateDepartment = validateDepartmentData(false);
export const validateUpdateDepartment = validateDepartmentData(true);
