const express = require("express");
const router = express.Router();

const { createCheckoutSession } = require("../controllers/checkout");

router.route("/").post(createCheckoutSession);

module.exports = router;
