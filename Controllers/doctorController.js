const doctorModel = require("../Models/doctorSchema");
const { connectionData } = require("./refactorHandle");

exports.connectionDoctor = connectionData(doctorModel);
