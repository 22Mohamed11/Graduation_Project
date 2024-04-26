const userModel = require("../Models/usersSchema.js");
const router = require("express").Router();
const {
  signUp,
  login,
  forgetPassword,
  verifyResetPasswordCode,
  resetPassword,
  updateLoggedUserPassword,
  uploadUserImage,
  resizeImage,
} = require("../Controllers/userController.js");

const {
  signUpValidator,
  loginValidator,
  resetPasswordValidator,
  updateLoggedUserPasswordValidator,
} = require("../Utils/Validators/signupValidator.js");

router.post("/signup", signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetPasswordCode", verifyResetPasswordCode);
router.put("/resetPassword", resetPasswordValidator, resetPassword);
router.put("/uploadUserImage", uploadUserImage, resizeImage);
router.put(
  "/editProfile/:_id/changePassword",
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.get("/getUser/:_id", async (req, res) => {
  const userId = req.params._id;
  const user = await userModel.findById(userId);
  if (!userId) return res.status(400).send({ message: "Invalid User ID" });
  res.json({ data: user });
});

module.exports = router;
function requireAuth(req, res, next) {
  if (!req.tokenData)
    return res.status(401).json({ message: "You are not logged in!" });
  else next();
}

module.exports = router;
