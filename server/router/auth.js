const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
} = require("../controllers/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/refresh").post(refreshToken);

router.route("/me").get(getCurrentUser);

module.exports = router;
