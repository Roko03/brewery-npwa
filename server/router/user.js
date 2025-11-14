const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  makeUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/user");

router.route("/").get(getAllUsers).post(makeUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:id/change-password").put(changePassword);

module.exports = router;
