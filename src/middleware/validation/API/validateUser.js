import { body, param } from "express-validator";
import User from "../../../models/User.js";
import checkEntityExists from "./helpers/checkEntityExists.js";
import checkFieldUniqueness from "./helpers/checkFieldUniqueness.js";

const validateUserData = (isUpdate = false) => [
  param("id")
    .if(() => isUpdate)
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .custom(checkEntityExists(User, "User")),
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .bail()
    .isLength({ min: 2 })
    .withMessage("First name has to be at least 2 characters."),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Last name has to be at least 2 characters."),
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .custom(checkFieldUniqueness(User, "email", isUpdate)),
  body("pin")
    .if(() => !isUpdate)
    .trim()
    .notEmpty()
    .withMessage("PIN is required.")
    .bail(),
  body("pin")
    .optional()
    .trim()
    .if((value) => value && value.length > 0)
    .isLength({ min: 4, max: 4 })
    .withMessage("PIN should be exactly 4 digits.")
    .bail()
    .isNumeric()
    .withMessage("PIN must only contain numbers."),
  body("is_admin")
    .notEmpty()
    .withMessage("Role is required.")
    .bail()
    .isInt({ min: 0, max: 1 })
    .withMessage("Role must be either Admin or User")
    .bail()
    .toInt(),
  body("is_active")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Status must be either Active or Inactive")
    .bail()
    .toInt(),
];

export const validateCreateUser = validateUserData(false);
export const validateUpdateUser = validateUserData(true);
