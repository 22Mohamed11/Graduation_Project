const mongoose = require("mongoose");
const specializationSchema = new mongoose.Schema({
  specialization: {
    type: String,
    required: true,
    unique: true,
  }, //name of the specialization
  specializationImage: {
    type: String,
    required: true,
  },
});

const imageUrl = (document) => {
  if (document.specializationImage) {
    const imageUrl = `http://localhost:2024/specialization/${document.specializationImage}`;
    document.specializationImage = imageUrl;
  }
};
specializationSchema
  .post("init", (document) => {
    imageUrl(document);
  })
  .post("save", (document) => {
    imageUrl(document);
  });

const specializationModel = mongoose.model(
  "specialization",
  specializationSchema
);
module.exports = specializationModel;
