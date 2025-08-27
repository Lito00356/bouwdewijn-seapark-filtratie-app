import { body, param } from "express-validator";
import MeasurementDefinition from "../../../models/Measurement_definition.js";
import checkEntityExists from "./helpers/checkEntityExists.js";
import checkFieldUniqueness from "./helpers/checkFieldUniqueness.js";

const validateMeasurementDefinitionData = (isUpdate = false) => [
  param("id")
    .if(() => isUpdate)
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .custom(checkEntityExists(MeasurementDefinition, "Measurement definition")),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .bail()
    .custom(checkFieldUniqueness(MeasurementDefinition, "name", isUpdate)),
  body("short_name")
    .trim()
    .notEmpty()
    .withMessage("Short-name is required.")
    .bail()
    .isLength({ min: 1, max: 50 })
    .withMessage("Short name must be between 1 and 50 characters")
    .bail(),
  body("unit")
    .trim()
    .notEmpty()
    .withMessage("Unit is required.")
    .bail()
    .isLength({ min: 1, max: 50 })
    .withMessage("Unit must be between 1 and 50 characters")
    .bail(),
  body("min_value")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isFloat()
    .withMessage(
      "Min value must be a number using a dot (.) as the decimal separator."
    )
    .bail()
    .toFloat(),
  body("max_value")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isFloat()
    .withMessage(
      "Max value must be a number using a dot (.) as the decimal separator."
    )
    .bail()
    .toFloat(),
  body("is_active")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Status must be either Active or Inactive")
    .bail()
    .toInt(),
];

export const validateCreateMeasurementDefinition =
  validateMeasurementDefinitionData(false);
export const validateUpdateMeasurementDefinition =
  validateMeasurementDefinitionData(true);
