const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const singnupRouter = require("./Routes/userRoute");
const DBConnection = require("./Config/DB");
const errorHandeling = require("./Middlewares/globalErrors");
const APIerrors = require("./Utils/errors");
const patientRouter = require("./Routes/patientRoute");
const doctorRouter = require("./Routes/doctorRoute");
dotenv.config({});
// connect with DB
DBConnection();
// express app
const app = express();
app.use(express.json());

//  middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/Diabest", singnupRouter);
app.use("/Patient", patientRouter);
app.use("/Doctor", doctorRouter);

app.all("*", (req, res, next) => {
  next(new APIerrors(`The route ${req.originalUrl} is not found`, 400));
});
app.use(errorHandeling);

const PORT = process.env.PORT || 2024;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
