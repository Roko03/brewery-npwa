const express = require("express");
const router = express.Router();

const {
  makeProducer,
  getAllProducers,
  getProducer,
  updateProducer,
  deleteProducer,
} = require("../controllers/producers");

const authenticationUser = require("../middleware/authentication");
const roleAuthentication = require("../middleware/role-authentication");

// Public routes (for filters)
router.route("/").get(getAllProducers);
router.route("/:id").get(getProducer);

// Admin-only routes
router
  .route("/")
  .post(authenticationUser, roleAuthentication(["ADMIN"]), makeProducer);

router
  .route("/:id")
  .put(authenticationUser, roleAuthentication(["ADMIN"]), updateProducer)
  .delete(authenticationUser, roleAuthentication(["ADMIN"]), deleteProducer);

module.exports = router;
