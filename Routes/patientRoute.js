const router = require("express").Router();
const {
  connectionPatient,
  updatePatient,
} = require("../Controllers/patientController.js");
const {
  patientValidator,
  UpdatePatientValidator,
} = require("../Utils/Validators/patientInfoValidator.js");

router.post("/patientRegisteration", patientValidator, connectionPatient);
router.put("/editProfile/:_id", UpdatePatientValidator, updatePatient);

module.exports = router;
