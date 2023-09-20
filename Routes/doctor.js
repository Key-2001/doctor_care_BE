const express = require("express");
const {
  getSingleDoctor,
  updatedDoctor,
  deleteDoctor,
  getAllDoctor,
} = require("../Controllers/doctorController");
const router = express.Router();

router
  .route("/:id")
  .get(getSingleDoctor)
  .put(updatedDoctor)
  .delete(deleteDoctor);
router.route("/").get(getAllDoctor);

module.exports = router;
