const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order");

const roleAuthentication = require("../middleware/role-authentication");

// User routes - get their own orders
router.route("/").get(getUserOrders).post(createOrder);

router.route("/:id").get(getOrderById);

// Admin routes - manage all orders
router
  .route("/admin/all")
  .get(roleAuthentication(["ADMIN"]), getAllOrders);

router
  .route("/admin/:id")
  .patch(roleAuthentication(["ADMIN"]), updateOrderStatus);

module.exports = router;
