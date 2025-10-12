const express = require("express");
const router = express.Router();
const roleAuthentication = require("../../middleware/role-authentication");
const {
  getAllBeerType,
  getBeerType,
  makeBeerType,
  updateBeerType,
  deleteBeerType,
} = require("../../controllers/beer/beerType");

router
  .route("/")
  .get(getAllBeerType)
  .post(roleAuthentication(["ADMIN"]), makeBeerType);

router
  .route("/:id")
  .get(getBeerType)
  .put(roleAuthentication(["ADMIN"]), updateBeerType)
  .delete(roleAuthentication(["ADMIN"]), deleteBeerType);

module.exports = router;
