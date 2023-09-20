const express = require("express");
const {
  getSingleUser,
  deleteUser,
  updateUser,
  getAllUser,
} = require("../Controllers/userController");
const { authenticate, restrict } = require("../auth/verifyToken");
const router = express.Router();

router
  .route("/:id")
  .get(authenticate, restrict(["patient"]), getSingleUser)
  .delete(authenticate, restrict(["patient"]), deleteUser)
  .put(authenticate, restrict(["patient"]), updateUser);
router.route("/").get(authenticate, restrict(["admin"]), getAllUser);

module.exports = router;
