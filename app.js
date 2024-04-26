const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const singnupRouter = require("./Routes/userRoute");
const DBConnection = require("./Config/DB");
const errorHandeling = require("./Middlewares/globalErrors");
const APIerrors = require("./Utils/Errors.js");
const patientRouter = require("./Routes/patientRoute");
const doctorRouter = require("./Routes/doctorRoute");
const specializationRouter = require("./Routes/specializationRoute.js");

dotenv.config({});

// connect with DB
DBConnection();

// express app
const app = express();
app.use(express.json());
// upload image profile
app.use(express.static("uploads"));
app.use(express.static("public"));
// cors to Access APIs
app.use(cors());

// Compress Response
app.use(compression());

//  middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
// Mount Routes
app.use("/Register", singnupRouter);
app.use("/Patient", patientRouter);
app.use("/Doctor", doctorRouter);
app.use("/Specialization", specializationRouter);
app.all("*", (req, res, next) => {
  next(new APIerrors(`The route ${req.originalUrl} is not found`, 400));
});
app.use(errorHandeling);

const PORT = process.env.PORT || 2024;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
