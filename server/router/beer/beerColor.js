const express = require("express");
const router = express.Router();
const roleAuthentication = require("../../middleware/role-authentication");
const {
  getAllBeerColor,
  makeBeerColor,
  getBeerColor,
  updateBeerColor,
  deleteBeerColor,
} = require("../../controllers/beer/beerColor");

router
  .route("/")
  .get(getAllBeerColor)
  .post(roleAuthentication(["ADMIN"]), makeBeerColor);

router
  .route("/:id")
  .get(getBeerColor)
  .put(roleAuthentication(["ADMIN"]), updateBeerColor)
  .delete(roleAuthentication(["ADMIN"]), deleteBeerColor);

module.exports = router;
