const UserModel = require("../models/UserSchema");
const DoctorModel = require("../models/DoctorSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};

const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;
  try {
    let user = null;
    if (role === "patient") {
      user = await UserModel.findOne({ email });
    } else if (role === "doctor") {
      user = await DoctorModel.findOne({ email });
    }

    //! check user existed
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    //! hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new UserModel({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    if (role === "doctor") {
      user = new DoctorModel({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = null;
    const patient = await UserModel.findOne({ email });
    const doctor = await DoctorModel.findOne({ email });
    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }
    //! check if user existed or not
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found!" });
    }
    //! compare password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials!" });
    }
    //! get token
    const token = generateToken(user);
    const { password, role, appointments, ...rest } = user._doc;

    return res.status(200).json({
      status: true,
      message: "Successfully login!!!",
      token,
      data: { ...rest },
      role,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error });
  }
};

module.exports = {
  register,
  login,
};
