import { body, param } from "express-validator";
import checkEntityExists from "./helpers/checkEntityExists.js";
import Action from "../../../models/Action.js";
import TaskLog from "../../../models/Task_log.js";
import checkObjectNameExists from "./helpers/checkObjectNameExists.js";

export const validateUpdateTaskLog = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .bail()
    .custom(checkEntityExists(TaskLog, "Task log")),
  body("action_id")
    .notEmpty()
    .withMessage("Action ID is required.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Action ID must be a positive integer")
    .bail()
    .custom(checkEntityExists(Action, "Action"))
    .bail()
    .toInt(),
  body("object_type")
    .trim()
    .notEmpty()
    .withMessage("Object type is required.")
    .bail()
    .isIn(["filter", "pump", "department", "sub_department"])
    .withMessage(
      "Invalid value for object type. Allowed values are: filter, pump, department, sub_department"
    ),
  body("object_name")
    .trim()
    .notEmpty()
    .withMessage("Object name is required.")
    .bail()
    .custom(checkObjectNameExists),
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
  body("is_complete")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Status must be either complete or incomplete")
    .bail()
    .toInt(),
];
