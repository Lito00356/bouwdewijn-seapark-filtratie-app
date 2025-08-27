import { body } from "express-validator";

const validateLogin = [
  body("user_id")
    .notEmpty()
    .withMessage("User ID is required.")
    .isNumeric()
    .withMessage("User ID must be a number."),
  body("pin")
    .trim()
    .notEmpty()
    .withMessage("PIN is required.")
    .bail()
    .isLength({ min: 4, max: 4 })
    .withMessage("PIN must be exactly 4 digits.")
    .bail()
    .matches(/^\d{4}$/)
    .withMessage("PIN must contain only digits."),
];

export default validateLogin;
