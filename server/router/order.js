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

router.route("/").get(getUserOrders).post(createOrder);

router.route("/:id").get(getOrderById);

router.route("/admin/all").get(roleAuthentication(["ADMIN"]), getAllOrders);

router
  .route("/admin/:id")
  .patch(roleAuthentication(["ADMIN"]), updateOrderStatus);

module.exports = router;
