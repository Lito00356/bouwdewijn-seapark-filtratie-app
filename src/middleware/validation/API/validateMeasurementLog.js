import { body, param } from "express-validator";
import MeasurementLog from "../../../models/Measurement_log.js";
import checkEntityExists from "./helpers/checkEntityExists.js";
import SubDepartment from "../../../models/Sub_department.js";
import validateMeasurements from "./helpers/validateMeasurements.js";

const validateMeasurementLogData = (isUpdate = false) => [
  param("id")
    .if(() => isUpdate)
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .custom(checkEntityExists(MeasurementLog, "Measurement log")),
  body("sub_id")
    .notEmpty()
    .withMessage("Sub-id is required.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Sub-id must be a positive integer")
    .bail()
    .custom(checkEntityExists(SubDepartment, "Sub department"))
    .bail()
    .toInt(),
  body("measurements")
    .isObject()
    .withMessage("Measurements are required and must be an object.")
    .bail()
    .custom(validateMeasurements),
  body("comment")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .trim(),
  body("comment_type")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isIn(["error", "observation", "other"])
    .withMessage(
      "Invalid value for comment type. Allowed values are: error, observation, other"
    ),
];

export const validateCreateMeasurementLog = validateMeasurementLogData(false);
export const validateUpdateMeasurementLog = validateMeasurementLogData(true);
