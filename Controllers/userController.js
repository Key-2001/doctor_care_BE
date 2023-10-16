const UserModel = require("../models/UserSchema");
const BookingModel = require("../models/BookingSchema");
const DoctorModel = require("../models/DoctorSchema");

const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to update" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: true, message: "Successfully deleted!" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to delete" });
  }
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id).select("-password");
    return res
      .status(200)
      .json({ status: true, message: "User found", data: user });
  } catch (error) {
    return res.status(500).json({ status: false, message: "No user found" });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await UserModel.find({}).select("-password");
    return res.status(200).json({
      status: true,
      message: "Users found",
      data: users,
    });
  } catch (error) {
    return res.status(404).json({ status: false, message: "Not found" });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { password, ...rest } = user._doc;
    return res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get " });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    //! Step - 1: retrieve appointments from booking for specific user
    const bookings = await BookingModel.find({ user: req.userId });

    //! Step - 2: extract doctor ids from appointment bookings
    const doctorIds = bookings.map((el) => el?.doctor.id);
    //! Step - 3: retrieve doctors using doctor ids
    const doctors = await DoctorModel.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get " });
  }
};

module.exports = {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getMyAppointments,
};
