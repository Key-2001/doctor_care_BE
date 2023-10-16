const express = require("express");
const {
  getSingleDoctor,
  updatedDoctor,
  deleteDoctor,
  getAllDoctor,
  getDoctorProfile,
} = require("../Controllers/doctorController");
const { authenticate, restrict } = require("../auth/verifyToken");
const reviewRoute = require("./review");
const router = express.Router();

//! nested route
router.use("/:doctorId/reviews", reviewRoute);

router
  .route("/:id")
  .get(getSingleDoctor)
  .put(authenticate, restrict(["doctor"]), updatedDoctor)
  .delete(authenticate, restrict(["doctor"]), deleteDoctor);
router
  .route("/profile/me")
  .get(authenticate, restrict(["doctor"]), getDoctorProfile);
router.route("/").get(getAllDoctor);

module.exports = router;
