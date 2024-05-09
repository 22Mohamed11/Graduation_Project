const { check } = require("express-validator");
const { validatorMiddleware } = require("../../Middlewares/Validator");
const specializations = require("../../Models/specialization");
const APIerrors = require("../errors");
// const slugify = require("slugify");

exports.doctorValidator = [
  check("specialization")
    .notEmpty()
    .withMessage("doctor specialization is required")
    .isMongoId()
    .withMessage("invalid specialization id")
    .custom(async (value) => {
      const specialization = await specializations.findById(value);
      if (!specialization) {
        return new APIerrors("this specialization is not found", 404);
      }
      return true;
    }),
  check("phoneNumber")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
  check("clinicAddress")
    .notEmpty()
    .withMessage("clinic address is required")
    .isLength({ min: 10, max: 50 })
    .withMessage("Address length must be between 10 and 50"),
  check("startTime").notEmpty().withMessage("start time is required"),
  check("endTime").notEmpty().withMessage("end time is required"),
  check("facebookLink")
    .notEmpty()
    .withMessage("facebook profile link is required")
    .custom((link) => {
      if (link.slice(0, 5) != "https") {
        return Promise.reject(new Error("you can use https protocol only"));
      }
      return true;
    }),
  check("whatsappLink")
    .notEmpty()
    .withMessage("whatsapp account link is required")
    .custom((link) => {
      if (link.slice(0, 5) != "https") {
        return Promise.reject(new Error("you can use https protocol only"));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateDoctorValidator = [
  check("specialization")
    .optional()
    .isMongoId()
    .withMessage("invalid specialization id")
    .custom((value) => {
      if (value) {
        Promise.reject(new Error("you can't update specialization"));
      }
      return true;
    }),
  check("fullName").optional().isLength({ min: 5, max: 50 }),
  check("phoneNumber")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
  check("clinicAddress")
    .optional()
    .isLength({ min: 10, max: 50 })
    .withMessage("Address length must be between 10 and 50"),
  check("startTime").optional(),
  check("endTime").optional(),
  check("facebookLink")
    .optional()
    .custom((link) => {
      if (link.slice(0, 5) != "https") {
        return Promise.reject(new Error("you can use https protocol only"));
      }
      return true;
    }),
  check("whatsappLink")
    .optional()
    .custom((link) => {
      if (link.slice(0, 5) != "https") {
        return Promise.reject(new Error("you can use https protocol only"));
      }
      return true;
    }),
  validatorMiddleware,
];
