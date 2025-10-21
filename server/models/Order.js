const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    beer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beer",
      required: true,
    },
    beer_name: {
      type: String,
      required: true,
    },
    beer_price: {
      type: Number,
      required: true,
    },
    beer_image_url: {
      type: String,
    },
    producer_name: {
      type: String,
    },
    beer_type_name: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID je obavezan"],
    },
    order_number: {
      type: String,
      unique: true,
    },
    stripe_session_id: {
      type: String,
      required: true,
    },
    stripe_payment_intent_id: {
      type: String,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "Narudžba mora imati barem jednu stavku",
      },
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "eur",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    payment_status: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    customer_email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Generate order number before saving
OrderSchema.pre("save", function (next) {
  if (this.isNew && !this.order_number) {
    // Generate order number: ORD-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0");
    this.order_number = `ORD-${dateStr}-${random}`;
  }
  next();
});

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema, "orders");

module.exports = OrderModel;
