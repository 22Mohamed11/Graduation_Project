const Jwt = require("jsonwebtoken");

exports.createToken = (payload) => {
  return Jwt.sign({ _id: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRED_TIME,
  });
};

exports.createResetToken = (payload) => {
  return Jwt.sign({ _id: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10m",
  });
};
