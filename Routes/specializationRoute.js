const router = require("express").Router();
const {
  uploadSpecializationImage,
  resizeImage,
  addSpecialization,
  getAllSpecializations,
} = require("../Controllers/specializationController");

const {
  createSpecializationValidator,
} = require("../Utils/Validators/specializationValidator");

router
  .route("/")
  .get(getAllSpecializations)
  .post(
    uploadSpecializationImage,
    resizeImage,
    createSpecializationValidator,
    addSpecialization
  );

module.exports = router;
