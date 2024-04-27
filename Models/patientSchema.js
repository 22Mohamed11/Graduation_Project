const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// Define the Patient Schema
const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  age: {
    type: Number,
    required: [true, "Please provide your age."],
    minlength: [1, "Age should be at least 2 characters long."],
    maxlength: [3, [Error("Max length is 3.")]],
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widow"],
    required: true,
  },
  diabeticComa: {
    type: Boolean,
    required: true,
  },
  somking: {
    type: Boolean,
    required: true,
  },
  geneticDiabetes: {
    type: Boolean,
    required: true,
  },
  bloodPresure: {
    type: Boolean,
    required: true,
  },
  heartDisease: {
    type: Boolean,
    required: true,
  },
  alcohols: {
    type: Boolean,
    required: true,
  },
  pancreasDisease: {
    type: Boolean,
    required: true,
  },
  // For Female
  oralContraceptives: {
    type: Boolean,
    required: true,
  },
  pregnant: {
    type: Boolean,
    required: true,
  },
  breastfeeding: {
    type: Boolean,
    required: true,
  },
});

const patientModel = mongoose.model("Patient information", patientSchema);
module.exports = patientModel;
