const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID je obavezan"],
    },
    beer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beer",
      required: [true, "Beer ID je obavezan"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Količina mora biti barem 1"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const CartModel =
  mongoose.models.Cart || mongoose.model("Cart", CartSchema, "cart");

module.exports = CartModel;
