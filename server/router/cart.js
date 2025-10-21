const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  createCheckoutSession,
} = require("../controllers/cart");

router.route("/").get(getCart).post(addToCart).delete(clearCart);

router.route("/checkout").post(createCheckoutSession);

router.route("/:id").put(updateCartQuantity).delete(removeFromCart);

module.exports = router;
