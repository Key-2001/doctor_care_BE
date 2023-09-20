const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./db/connect");

//!Routes import
const authRoute = require("./Routes/auth");
const userRoute = require("./Routes/user");
const doctorRoute = require("./Routes/doctor");
const reviewRoute = require("./Routes/review");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: "*",
  credentials: true,
};

//! Routes

//! database connection

//! middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/photos"));
app.use(express.static("public/imgs"));
app.use(express.json());
app.use(cookieParser());
// app.use(multer().none())
app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
