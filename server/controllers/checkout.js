const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const userId = req.user._id;
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    throw new BadRequestError("Košarica je prazna");
  }

  const orderItems = cartItems.map((item) => ({
    beer_id: item.beer_id,
    beer_name: item.beer.name,
    beer_price: item.beer.price,
    beer_image_url: item.beer.image_url,
    producer_name: item.beer.producer_name || "N/A",
    beer_type_name: item.beer.beer_type_name || "N/A",
    quantity: item.quantity,
    subtotal: item.beer.price * item.quantity,
  }));

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const lineItems = cartItems.map((item) => {
    const beer = item.beer;
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: beer.name,
          description: `${beer.producer_name || "N/A"} - ${
            beer.beer_type_name || "N/A"
          }`,
          images: beer.image_url ? [beer.image_url] : [],
        },
        unit_amount: Math.round(beer.price * 100),
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
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
  createCheckoutSession,
};
