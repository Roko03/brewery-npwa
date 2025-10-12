const mongoose = require("mongoose");

const ProducerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ime proizvođača je obavezno"],
      unique: true,
    },
    country: {
      type: String,
      required: [true, "Država je obavezna"],
    },
    description: {
      type: String,
      default: null,
    },
    founded_year: {
      type: Number,
      default: null,
    },
    logo_url: {
      type: String,
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const ProducerModel =
  mongoose.models.Producer ||
  mongoose.model("Producer", ProducerSchema, "producers");

module.exports = ProducerModel;
