const router = require("express").Router();
const { connectionDoctor } = require("../Controllers/doctorController.js");
const {
  doctorValidator,
} = require("../Utils/Validators/doctorInfoValidator.js");

router.post("/doctorRegisteration", doctorValidator, connectionDoctor);

module.exports = router;
