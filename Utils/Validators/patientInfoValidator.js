const { check } = require("express-validator");
const { validatorMiddleware } = require("../../Middlewares/Validator");

exports.patientValidator = [
  check("age")
    .notEmpty()
    .withMessage("Age is required")
    .isNumeric()
    .isLength({ min: 2, max: 3 })
    .withMessage("provide a valid age between 0 and 999.")
    .toInt(),
  check("weight")
    .notEmpty()
    .withMessage("Weight is required")
    .isNumeric()
    .isLength({ min: 2, max: 3 })
    .withMessage("provide a valid Weight")
    .custom((val) => {
      if (val < 1 || val > 450) {
        throw new Error("Provide a valid weight between 1 and 450.");
      } else {
        return true;
      }
    }),
  check("height")
    .notEmpty()
    .withMessage("Height is required")
    .isNumeric()
    .isLength({ min: 3, max: 3 })
    .withMessage("provide a valid Height")
    .custom((val) => {
      if (val < 1 || val > 300) {
        throw new Error("Provide a valid Height between 1 and 450.");
      } else {
        return true;
      }
    }),
  validatorMiddleware,
];

exports.UpdatePatientValidator = [
  check("age")
    .optional()
    .isNumeric()
    .isLength({ min: 2, max: 3 })
    .withMessage("provide a valid age between 0 and 999.")
    .toInt(),
  check("weight")
    .optional()
    .isNumeric()
    .isLength({ min: 2, max: 3 })
    .withMessage("provide a valid Weight")
    .custom((val) => {
      if (val < 1 || val > 450) {
        throw new Error("Provide a valid weight between 1 and 450.");
      } else {
        return true;
      }
    }),
  check("height")
    .optional()
    .isNumeric()
    .isLength({ min: 3, max: 3 })
    .withMessage("provide a valid Height")
    .custom((val) => {
      if (val < 1 || val > 300) {
        throw new Error("Provide a valid Height between 1 and 450.");
      } else {
        return true;
      }
    }),
  validatorMiddleware,
];
