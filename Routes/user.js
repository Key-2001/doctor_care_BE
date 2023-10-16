const express = require("express");
const {
  getSingleUser,
  deleteUser,
  updateUser,
  getAllUser,
  getUserProfile,
  getMyAppointments,
} = require("../Controllers/userController");
const { authenticate, restrict } = require("../auth/verifyToken");
const router = express.Router();

router
  .route("/:id")
  .get(authenticate, restrict(["patient"]), getSingleUser)
  .delete(authenticate, restrict(["patient"]), deleteUser)
  .put(authenticate, restrict(["patient"]), updateUser);
router.route("/").get(authenticate, restrict(["admin"]), getAllUser);
router
  .route("/profile/me")
  .get(authenticate, restrict(["patient"]), getUserProfile);
router
  .route("/appointments/my-appointment")
  .get(authenticate, restrict(["patient"]), getMyAppointments);

module.exports = router;
