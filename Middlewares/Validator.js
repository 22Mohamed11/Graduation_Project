const { validationResult } = require("express-validator");

// Extracts and Processes any Validation Errors Generated
exports.validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
