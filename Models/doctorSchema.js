const mongoose = require("mongoose");
// Define the Patient Schema
const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  specialization: {
    type: mongoose.Schema.ObjectId,
    ref: "Specialization", // The Specialization model is required for this to work
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  clinicAddress: {
    type: String,
    required: true,
    match: /^[a-zA-Z\s]+\/[a-zA-Z\s]+\/[a-zA-Z0-9\s]+$/, // Example : "Street Name/City/Country"
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  facebookLink: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  whatsappLink: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

const doctorModel = mongoose.model("Doctor information", doctorSchema);
module.exports = doctorModel;
