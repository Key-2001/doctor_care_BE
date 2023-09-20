const ReviewModel = require("../models/ReviewSchema");
const DoctorModel = require("../models/DoctorSchema");

const getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({});
    return res
      .status(200)
      .json({ status: true, message: "Successfully", data: reviews });
  } catch (error) {
    return res.status(404).json({ status: false, message: "Not found" });
  }
};

const createReview = async (req, res) => {
  if (!req.body.doctor) {
    req.body.doctor = req.params.doctorId;
  }
  if (!req.body.user) {
    req.body.user = req.userId;
  }

  const newReview = new ReviewModel(req.body);

  try {
    const savedReview = await newReview.save();
    await DoctorModel.findByIdAndUpdate(req.body.doctor, {
      $push: { review: savedReview._id },
    });

    return res
      .status(200)
      .json({ status: true, message: "Review submitted", data: savedReview });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { getAllReviews, createReview };
