const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");
const specializationModel = require("../Models/specialization");
const { uploadSingleimage } = require("../Middlewares/uploadimagesMiddleware");

// Profile Images
exports.uploadSpecializationImage = uploadSingleimage("specializationImage");
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `specialization-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(350, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/specialization/${fileName}`);
    req.body.specializationImage = fileName;
  }
  next();
});

exports.addSpecialization = expressAsyncHandler(async (req, res) => {
  const specialization = await specializationModel.create(req.body);
  res.json({ data: specialization });
});

exports.getAllSpecializations = expressAsyncHandler(async (req, res) => {
  const allSpecializations = await specializationModel.find();
  res.json({ data: allSpecializations });
});
