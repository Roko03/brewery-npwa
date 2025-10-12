const express = require("express");
const router = express.Router();
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
  .post(roleAuthentication(["ADMIN"]), makeBeer);

router
  .route("/:id")
  .get(getBeer)
  .put(roleAuthentication(["ADMIN"]), updateBeer)
  .delete(roleAuthentication(["ADMIN"]), deleteBeer);

module.exports = router;
