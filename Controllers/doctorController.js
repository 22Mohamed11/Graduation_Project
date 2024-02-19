const expressAsyncHandler = require("express-async-handler");
const Jwt = require("jsonwebtoken");
const userModel = require("../Models/usersSchema");
const doctorModel = require("../Models/doctorSchema");
const APIerrors = require("../Utils/Errors");
// Connections Between User and Patient
exports.connectionDoctor = expressAsyncHandler(async (req, res, next) => {
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
  const user = await userModel.findById(decoded._id);
  if (!user) {
    return next(new APIerrors("The user does not exist anymore...", 404));
  }
  const userrole = await doctorModel.create({
    ...req.body,
    fullName: user.fullName,
  });
  const updatedUser = await userModel.findByIdAndUpdate(
    decoded._id,
    { doctor: userrole._id },
    { new: true }
  );

  // const token = createToken(user._id);
  res.status(201).json({ updatedUser, token });
});
