const jwt = require("jsonwebtoken");
const DoctorModel = require("../models/DoctorSchema");
const UserModel = require("../models/UserSchema");

const authenticate = async (req, res, next) => {
  //! get token from headers
  const authToken = req.headers.authorization;
  //! check token exists
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: false, message: "No token, authorization denied" });
  }
  try {
    const token = authToken.split(" ")[1];
    //! verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decode.id;
    req.role = decode.role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }

    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;

  const patient = await UserModel.findById(userId);
  const doctor = await DoctorModel.findById(userId);

  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }
  if (!roles.includes(user.role)) {
    return res
      .status(401)
      .json({ status: false, message: "You're not authorized" });
  }
  next();
};

module.exports = { authenticate, restrict };
