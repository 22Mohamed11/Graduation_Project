const router = require("express").Router();
const {
  connectionDoctor,
  updateDoctor,
} = require("../Controllers/doctorController.js");
const {
  doctorValidator,
  updateDoctorValidator,
} = require("../Utils/Validators/doctorInfoValidator.js");

router.post("/doctorRegisteration", doctorValidator, connectionDoctor);
router.put("/editProfile/:_id", updateDoctorValidator, updateDoctor);

module.exports = router;
