const express = require("express");
const router = express.Router();
const authenticationUser = require("../../middleware/authentication");
const roleAuthentication = require("../../middleware/role-authentication");
const {
  getAllBeers,
  getBeer,
  makeBeer,
  updateBeer,
  deleteBeer,
} = require("../../controllers/beer/beer");

router
  .route("/")
  .get(getAllBeers)
  .post(authenticationUser, roleAuthentication(["ADMIN"]), makeBeer);

router
  .route("/:id")
  .get(getBeer)
  .put(authenticationUser, roleAuthentication(["ADMIN"]), updateBeer)
  .delete(authenticationUser, roleAuthentication(["ADMIN"]), deleteBeer);

module.exports = router;
