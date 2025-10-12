const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  makeUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

router.route("/").get(getAllUsers).post(makeUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
