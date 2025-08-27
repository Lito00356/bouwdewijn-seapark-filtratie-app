import { body, param } from "express-validator";
import checkEntityExists from "./helpers/checkEntityExists.js";
import checkFieldUniqueness from "./helpers/checkFieldUniqueness.js";

import Department from "../../../models/Department.js";
import SubDepartment from "../../../models/Sub_department.js";
import Filter from "../../../models/Filter.js";
import Pump from "../../../models/Pump.js";

const validateGenericData = (
  isUpdate = false,
  foreignKey,
  model,
  foreignModel,
  entityName,
  foreignEntityName
) => [
  param("id")
    .if(() => isUpdate)
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .custom(checkEntityExists(model, entityName)),
  body(foreignKey)
    .notEmpty()
    .withMessage(`${foreignKey} is required.`)
    .bail()
    .isInt({ min: 1 })
    .withMessage(`${foreignKey} must be a positive integer`)
    .bail()
    .custom(checkEntityExists(foreignModel, foreignEntityName))
    .bail()
    .toInt(),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .bail()
    .custom(checkFieldUniqueness(model, "name", isUpdate)),
  body("is_active")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Status must be either Active or Inactive")
    .bail()
    .toInt(),
];

export const validateCreatePump = validateGenericData(
  false,
  "sub_id",
  Pump,
  SubDepartment,
  "Pump",
  "Sub-department"
);

export const validateUpdatePump = validateGenericData(
  true,
  "sub_id",
  Pump,
  SubDepartment,
  "Pump",
  "Sub-department"
);

export const validateCreateFilter = validateGenericData(
  false,
  "sub_id",
  Filter,
  SubDepartment,
  "Filter",
  "Sub-department"
);

export const validateUpdateFilter = validateGenericData(
  true,
  "sub_id",
  Filter,
  SubDepartment,
  "Filter",
  "Sub-department"
);

export const validateCreateSubDepartment = validateGenericData(
  false,
  "department_id",
  SubDepartment,
  Department,
  "Sub-department",
  "Department"
);

export const validateUpdateSubDepartment = validateGenericData(
  true,
  "department_id",
  SubDepartment,
  Department,
  "Sub-department",
  "Department"
);
