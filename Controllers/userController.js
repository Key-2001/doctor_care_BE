const UserModel = require("../models/UserSchema");

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
    return res
      .status(500)
      .json({ status: false, message: "Failed to delete" });
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

module.exports = {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
