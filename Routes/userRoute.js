const router = require("express").Router();
const {
  signUp,
  login,
  forgetPassword,
  verifyResetPasswordCode,
  resetPassword,
} = require("../Controllers/userController.js");

const {
  signUpValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../Utils/Validators/signupValidator.js");

router.post("/signup", signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetPasswordCode", verifyResetPasswordCode);
router.put("/resetPassword", resetPasswordValidator, resetPassword);
module.exports = router;
