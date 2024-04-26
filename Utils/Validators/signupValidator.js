const { check } = require("express-validator");
const { validatorMiddleware } = require("../../Middlewares/Validator");
const userModel = require("../../Models/usersSchema");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");

exports.signUpValidator = [
  //checking if the Full Name exists in database or not
  check("fullName")
    .notEmpty()
    .withMessage("user name is required")
    .isLength({ min: 5, max: 50 })
    .withMessage("name length must be between 2 and 50")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  //checking if the national id exists in database or not
  check("nationalId")
    .notEmpty()
    .withMessage("nationalId is required")
    .isNumeric()
    .isLength({ min: 14, max: 14 })
    .withMessage("National ID Must be have 14 Number")
    .custom((val) =>
      userModel.findOne({ nationalId: val }).then((value) => {
        if (value) {
          return Promise.reject(new Error("This NationalId already exists"));
        }
      })
    ),
  //checking if the Email exists in database or not
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This Email already exists"));
        }
      })
    ),
  //checking if the Password exists in database or not
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password should be between 6 and 20")
    .custom((pass, { req }) => {
      if (pass != req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  //checking if the Confirm Password exists in database or not
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("confirm Password should be between 6 and 20"),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
  validatorMiddleware,
];
// Login by Email and Password
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid email"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password should be between 6 and 20"),
  validatorMiddleware,
];

// Check New Password
exports.resetPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password should be between 6 and 20")
    .custom((pass, { req }) => {
      if (pass != req.body.confirmNewPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  //checking if the Confirm Password exists in database or not
  check("confirmNewPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("confirm Password should be between 6 and 20"),
  validatorMiddleware,
];

exports.updateLoggedUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage(" You Must Enter Your current Password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6 char and at most 14 char"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("You Must Enter Password Confirm")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "Password Confirmation must be at least 6 char and at most 14 char"
    ),
  check("password")
    .notEmpty()
    .withMessage("You Must Enter New Password")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "Password Confirmation must be at least 6 char and at most 14 char"
    )
    .custom(async (val, { req }) => {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return Promise.reject(new Error("token not found"));
      }
      const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await userModel.findById(decoded._id);
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("current Password is wrong");
      }
      if (val !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  validatorMiddleware,
];
