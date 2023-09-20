const express = require("express");
const {
  getSingleUser,
  deleteUser,
  updateUser,
  getAllUser,
} = require("../Controllers/userController");
const router = express.Router();

router.route("/:id").get(getSingleUser).delete(deleteUser).put(updateUser);
router.route("/").get(getAllUser);

module.exports = router;
