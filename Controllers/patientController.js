const expressAsyncHandler = require("express-async-handler");
const Jwt = require("jsonwebtoken");
const userModel = require("../Models/usersSchema");
const patientModel = require("../Models/patientSchema");
const APIerrors = require("../Utils/errors");
const slugify  = require("slugify");
// Connections Between User and Patient
exports.connectionPatient = expressAsyncHandler(async (req, res, next) => {
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
  const userrole = await patientModel.create({
    ...req.body,
    fullName: user.fullName,
  });
  const updatedUser = await userModel.findByIdAndUpdate(
    decoded._id,
    { patient: userrole._id },
    { new: true }
  );
  res.status(201).json({ updatedUser, token });
});

exports.updatePatient = expressAsyncHandler(async (req, res, next) => {
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
  const patient = await patientModel.findByIdAndUpdate(user.patient, req.body, {
    new: true,
  });
  if (req.body.fullName) {
    await userModel.findOneAndUpdate(
      { patient: patient._id },
      { fullName: req.body.fullName,
        slug:slugify(req.body.fullName)
      },
      { new: true }
    );
  }
  if (!user) {
    return next(new APIerrors("The user does not exist anymore...", 404));
  }

  // const token = createToken(user._id);
  res.status(201).json({ user });
});
