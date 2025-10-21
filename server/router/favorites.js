const express = require("express");
const router = express.Router();
const {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  removeFavoriteByBeerId,
  checkFavorite,
} = require("../controllers/favorites");

router.route("/").get(getUserFavorites).post(addFavorite);

router.route("/:id").delete(removeFavorite);

router.route("/beer/:beerId").delete(removeFavoriteByBeerId);

router.route("/check/:beerId").get(checkFavorite);

module.exports = router;
