const { check } = require("express-validator");
const { validatorMiddleware } = require("../../Middlewares/Validator");
// const slugify = require("slugify");

exports.doctorValidator = [
  check("phoneNumber")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
  check("clinicAddress")
    .notEmpty()
    .withMessage("Clinic Address is required")
    .isLength({ min: 10, max: 50 })
    .withMessage("Address length must be between 10 and 50"),
  validatorMiddleware,
];
