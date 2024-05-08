const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const singnupRouter = require("./Routes/userRoute.js");
const DBConnection = require("./Config/DB.js");
const errorHandeling = require("./Middlewares/globalErrors.js");
const APIerrors = require("./Utils/Errors.js");
const patientRouter = require("./Routes/patientRoute.js");
const doctorRouter = require("./Routes/doctorRoute.js");
const specializationRouter = require("./Routes/specializationRoute.js");
//import { SpeedInsights } from "@vercel/speed-insights/next"
//const organsRouter = require("./Routes/organsRoute.js");

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
//app.use("/Organs,organsRouter");
app.all("*", (req, res, next) => {
  next(new APIerrors(`The route ${req.originalUrl} is not found`, 400));
});
app.use(errorHandeling);

const PORT = process.env.PORT || 2024;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});