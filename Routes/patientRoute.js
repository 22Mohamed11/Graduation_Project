const router = require("express").Router();
const { connectionPatient } = require("../Controllers/patientController.js");
const {
  patientValidator,
} = require("../Utils/Validators/patientInfoValidator.js");

router.post("/patientRegisteration", patientValidator, connectionPatient);

module.exports = router;
