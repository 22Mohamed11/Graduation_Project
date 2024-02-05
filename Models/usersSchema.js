const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema for user model
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "user name is Required"],
      minlength: [5, "min length must be 20 char"],
      maxlength: [50, "max length must be 50 char"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    nationalId: {
      type: Number,
      unique: true,
      required: true,
      trim: true,
      index: true,
      minlength: 14,
      maxlength: 14,
      match: /^[0-9]{6}-?([0-9]{2}){4}$/,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is Required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is Required"],
      minlength: [6, "Password should be between 6 and 14"],
      maxlength: [20, "Password should be between 6 and 14"],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetCode: {
      type: String,
    },
    passwordResetCodeExpires: {
      type: Date,
    },
    passwordResetCodeVerify: {
      type: Boolean,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    profileImage: {
      type: String,
      default: "user-profile-image.jpg", // Profile image Option
    },
    role: {
      type: String,
      enum: ["Admin", "Patient", "Doctor"],
    },
    active: {
      type: Boolean,
      default: true,
    },

    // concatunation between 2 collection
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: "Patient information",
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor information",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(/^find/, function (next) {
  this.populate({ path: "patient" });
  this.populate({ path: "doctor" });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("Sign up", userSchema);
module.exports = userModel;
