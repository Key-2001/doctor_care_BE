const BookingModel = require("../models/BookingSchema");
const DoctorModel = require("../models/DoctorSchema");

const updatedDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to update" });
  }
};

const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await DoctorModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: true, message: "Successfully deleted!" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to delete" });
  }
};

const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await DoctorModel.findById(id)
      .populate("reviews")
      .select("-password");
    return res.status(200).json({
      status: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "No doctor found" });
  }
};

const getAllDoctor = async (req, res) => {
  const { query } = req.query;
  try {
    let doctors = null;
    if (query) {
      doctors = await DoctorModel.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $option: "i" } },
          { specialization: { $regex: query, $option: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await DoctorModel.find({ isApproved: "approved" }).select(
        "-password"
      );
    }
    return res
      .status(200)
      .json({ status: true, message: "Doctors found", data: doctors });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Not found" });
  }
};

const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  try {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const { password, ...rest } = doctor._doc;
    const appointments = await BookingModel.find({ doctor: doctorId });
    return res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};

module.exports = {
  updatedDoctor,
  deleteDoctor,
  getSingleDoctor,
  getAllDoctor,
  getDoctorProfile,
};
