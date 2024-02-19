const { check } = require("express-validator");
const { validatorMiddleware } = require("../../Middlewares/Validator");
const specializationModel = require("../../Models/specialization");

exports.createSpecializationValidator = [
  //checking if the specialization
  check("specialization")
    .notEmpty()
    .withMessage("specialization is required")
    .isLength({ min: 5, max: 50 })
    .withMessage("specialization length must be between 2 and 50")
    .custom(
      async (val) =>
        await specializationModel
          .findOne({ specialization: val })
          .then((value) => {
            if (value) {
              return Promise.reject(
                new Error("This specialization must be unique")
              );
            }
          })
    ),
  //checking if the specializationImage
  check("specializationImage")
    .notEmpty()
    .withMessage("specializationImage is required"),
  validatorMiddleware,
];
