const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Jwt = require("jsonwebtoken");
const sharp = require("sharp");
const { uploadSingleimage } = require("../Middlewares/uploadimagesMiddleware");
const userModel = require("../Models/usersSchema");
const APIerrors = require("../Utils/errors");
const sendEmail = require("../Utils/sendEmail");
const { createToken, createResetToken } = require("../Utils/createToken");

exports.signUp = expressAsyncHandler(async (req, res) => {
  const user = await userModel.create(req.body);
  const token = createToken(user._id);
  res.status(201).json({ user, token });
});

// Login By Email and Password
exports.login = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new APIerrors("Invalid email or password", 401));
  }
  const token = createToken(user._id);
  res.status(200).json({ user, token });
});

// Profile Images
exports.uploadUserImage = uploadSingleimage("profileImage");
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `user-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(450, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/usersImages/${fileName}`);
    req.body.profileImage = fileName;
    res.json({ message: "success" });
  }
});
// router.post("upload", upload.single("image"), function (req, res) {
//   cloudinary.uploader.upload(req.file.path, function (err, result) {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({
//         success: false,
//         message: "Error",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "uploaded",
//       data: result,
//     });
//   });
// });

exports.updateLoggedUserPassword = expressAsyncHandler(async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(
        new APIerrors(
          "You are not logged in! Please log in to get access.",
          401
        )
      );
    }
  }
  const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await userModel.findByIdAndUpdate(
    decoded._id,
    {
      password: await bcrypt.hash(req.body.password, 13),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  token = createToken(user._id);
  res
    .status(200)
    .json({ message: "your password updated successfully", token });
});

exports.forgetPassword = expressAsyncHandler(async (req, res, next) => {
  // Get the user by email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new APIerrors("No account with this email address exists.", 400)
    );
  }

  // Create a random reset code from 6 numbers
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // set the hashed reset code in user DB
  user.passwordResetCode = hashedResetCode;

  // set expire time for reset code
  user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetCodeVerify = false;

  // Save the updated Data
  await user.save({ validateBeforeSave: false });

  // Send the reset code to email
  const message = `مرحبا ${user.fullName}
    رمز التحقق الخاص بك هو ${resetCode}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "تغيير كلمة المرور",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetCodeVerify = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new APIerrors(
        "Error while sending a password reset code... try again later"
      )
    );
  }
  const resetToken = createResetToken(user._id);
  res.status(200).json({ success: true, resetToken, msg: "check your email" });
});

// verify Reset Password Code
exports.verifyResetPasswordCode = expressAsyncHandler(
  async (req, res, next) => {
    let resetToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      resetToken = req.headers.authorization.split(" ")[1];
    }
    if (!resetToken) {
      return next(
        new APIerrors("You do not have permission to verify reset code.", 400)
      );
    }

    const decodedToken = Jwt.verify(resetToken, process.env.JWT_SECRET_KEY);

    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");

    const user = await userModel.findOne({
      _id: decodedToken._id,
      passwordResetCode: hashedResetCode,
      passwordResetCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new APIerrors("Invalid or expired reset code"));
    }
    user.passwordResetCodeVerify = true;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, resetToken, data: user });
  }
);

exports.resetPassword = expressAsyncHandler(async (req, res, next) => {
  let resetToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    resetToken = req.headers.authorization.split(" ")[1];
  }
  if (!resetToken) {
    return next(
      new APIerrors("You do not have permission to verify reset code.", 400)
    );
  }

  const decodedToken = Jwt.verify(resetToken, process.env.JWT_SECRET_KEY);

  const user = await userModel.findOne({
    _id: decodedToken._id,
    passwordResetCodeVerify: true,
  });
  if (!user) {
    return next(new APIerrors("Please verify your email first", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetCodeVerify = undefined;
  user.passwordChangedAt = Date.now();

  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, data: "Password has been changed" });
});
