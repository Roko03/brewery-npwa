const Cart = require("../models/Cart");
const Beer = require("../models/Beer");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getCart = async (req, res) => {
  const userId = req.user._id;

  const cartItems = await Cart.find({ user_id: userId })
    .populate({
      path: "beer_id",
      populate: [
        { path: "producer_id", select: "name" },
        { path: "beer_type_id", select: "name" },
        { path: "beer_color_id", select: "name" },
      ],
    })
    .sort({ created_at: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    entities: cartItems,
    totalCount: cartItems.length,
  });
};

const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { beer_id, quantity = 1 } = req.body;

  if (!beer_id) {
    throw new BadRequestError("Beer ID je obavezan");
  }

  // Check if beer exists
  const beer = await Beer.findById(beer_id);
  if (!beer) {
    throw new NotFoundError("Pivo nije pronađeno");
  }

  // Check if item already exists in cart
  const existingCartItem = await Cart.findOne({ user_id: userId, beer_id });

  if (existingCartItem) {
    // Update quantity
    existingCartItem.quantity += quantity;
    await existingCartItem.save();

    const populatedItem = await Cart.findById(existingCartItem._id).populate({
      path: "beer_id",
      populate: [
        { path: "producer_id", select: "name" },
        { path: "beer_type_id", select: "name" },
        { path: "beer_color_id", select: "name" },
      ],
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      entity: populatedItem,
      message: "Količina ažurirana u košarici",
    });
  }

  // Create new cart item
  const cartItem = await Cart.create({
    user_id: userId,
    beer_id,
    quantity,
  });

  const populatedItem = await Cart.findById(cartItem._id).populate({
    path: "beer_id",
    populate: [
      { path: "producer_id", select: "name" },
      { path: "beer_type_id", select: "name" },
      { path: "beer_color_id", select: "name" },
    ],
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    entity: populatedItem,
    message: "Pivo dodano u košaricu",
  });
};

const updateCartQuantity = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    throw new BadRequestError("Količina mora biti barem 1");
  }

  const cartItem = await Cart.findOne({ _id: id, user_id: userId });

  if (!cartItem) {
    throw new NotFoundError("Stavka košarice nije pronađena");
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  const populatedItem = await Cart.findById(cartItem._id).populate({
    path: "beer_id",
    populate: [
      { path: "producer_id", select: "name" },
      { path: "beer_type_id", select: "name" },
      { path: "beer_color_id", select: "name" },
    ],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    entity: populatedItem,
    message: "Količina ažurirana",
  });
};

const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const cartItem = await Cart.findOneAndDelete({ _id: id, user_id: userId });

  if (!cartItem) {
    throw new NotFoundError("Stavka košarice nije pronađena");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Stavka uklonjena iz košarice",
  });
};

const clearCart = async (req, res) => {
  const userId = req.user._id;

  await Cart.deleteMany({ user_id: userId });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Košarica ispražnjena",
  });
};

const createCheckoutSession = async (req, res) => {
  const userId = req.user._id;

  // Fetch cart items with populated beer details
  const cartItems = await Cart.find({ user_id: userId }).populate({
    path: "beer_id",
    populate: [
      { path: "producer_id", select: "name" },
      { path: "beer_type_id", select: "name" },
      { path: "beer_color_id", select: "name" },
    ],
  });

  if (!cartItems || cartItems.length === 0) {
    throw new BadRequestError("Košarica je prazna");
  }

  // Prepare order items snapshot
  const orderItems = cartItems.map((item) => ({
    beer_id: item.beer_id._id,
    beer_name: item.beer_id.name,
    beer_price: item.beer_id.price,
    beer_image_url: item.beer_id.image_url,
    producer_name: item.beer_id.producer_id?.name,
    beer_type_name: item.beer_id.beer_type_id?.name,
    quantity: item.quantity,
    subtotal: item.beer_id.price * item.quantity,
  }));

  // Calculate total
  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Convert cart items to Stripe line items
  const lineItems = cartItems.map((item) => {
    const beer = item.beer_id;
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: beer.name,
          description: `${beer.producer_id?.name || "N/A"} - ${beer.beer_type_id?.name || "N/A"}`,
          images: beer.image_url ? [beer.image_url] : [],
        },
        unit_amount: Math.round(beer.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    };
  });

  // Create Stripe checkout session with metadata
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/cart`,
    customer_email: req.user.email,
    metadata: {
      user_id: userId.toString(),
      order_items: JSON.stringify(orderItems),
      total_amount: totalAmount.toString(),
    },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    sessionId: session.id,
    url: session.url,
    orderData: {
      items: orderItems,
      total_amount: totalAmount,
      customer_email: req.user.email,
    },
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  createCheckoutSession,
};
