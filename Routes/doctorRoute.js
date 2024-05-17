const router = require("express").Router();
const {
  connectionDoctor,
  updateDoctor,
  getAllDoctors,
} = require("../Controllers/doctorController.js");
const {
  doctorValidator,
  updateDoctorValidator,
} = require("../Utils/Validators/doctorInfoValidator.js");

router.post("/doctorRegisteration", doctorValidator, connectionDoctor);
router.put("/editProfile/:_id", updateDoctorValidator, updateDoctor);
router.get("/getAllDoctors",getAllDoctors)
module.exports = router;
