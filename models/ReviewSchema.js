const mongoose = require("mongoose");
const DoctorModel = require("./DoctorSchema");
const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  //! this points the current review
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await DoctorModel.findByIdAndUpdate(doctorId, {
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].averageRating,
  });
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor);
});

module.exports = mongoose.model("Review", reviewSchema);
