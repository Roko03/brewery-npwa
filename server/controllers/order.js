const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createOrder = async (req, res) => {
  const userId = req.user._id;
  const {
    stripe_session_id,
    stripe_payment_intent_id,
    items,
    total_amount,
    customer_email,
  } = req.body;

  if (!stripe_session_id || !items || !total_amount || !customer_email) {
    throw new BadRequestError("Svi podaci o narudžbi su obavezni");
  }

  if (!items || items.length === 0) {
    throw new BadRequestError("Narudžba mora imati barem jednu stavku");
  }

  // Create order
  const order = await Order.create({
    user_id: userId,
    stripe_session_id,
    stripe_payment_intent_id,
    items,
    total_amount,
    customer_email,
    status: "completed",
    payment_status: "paid",
    currency: "eur",
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    entity: order,
    message: "Narudžba uspješno kreirana",
  });
};

const getUserOrders = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const query = { user_id: userId };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .sort({ created_at: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const totalCount = await Order.countDocuments(query);

  res.status(StatusCodes.OK).json({
    success: true,
    entities: orders,
    totalCount,
    page: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
  });
};

const getOrderById = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, user_id: userId });

  if (!order) {
    throw new NotFoundError("Narudžba nije pronađena");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    entity: order,
  });
};

const getAllOrders = async (req, res) => {
  const { page = 1, limit = 10, status, user_id } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }
  if (user_id) {
    query.user_id = user_id;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate("user_id", "name email")
    .sort({ created_at: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const totalCount = await Order.countDocuments(query);

  res.status(StatusCodes.OK).json({
    success: true,
    entities: orders,
    totalCount,
    page: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
  });
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw new NotFoundError("Narudžba nije pronađena");
  }

  if (status) {
    order.status = status;
  }
  if (payment_status) {
    order.payment_status = payment_status;
  }

  await order.save();

  res.status(StatusCodes.OK).json({
    success: true,
    entity: order,
    message: "Status narudžbe ažuriran",
  });
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
