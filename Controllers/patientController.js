const patientModel = require("../Models/patientSchema");
const { connectionData } = require("./refactorHandle");

exports.connectionPatient = connectionData(patientModel);
