const multer = require("multer");
const APIerrors = require("../Utils/Errors.js");

const uploadOptions = () => {
  // MemoryStorage Engine
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new APIerrors("Not an image!", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};
exports.uploadSingleimage = (fieldName) => {
  return uploadOptions().single(fieldName);
};
