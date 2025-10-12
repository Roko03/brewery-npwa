const mongoose = require("mongoose");

const BeerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ime piva je obavezno"],
    },
    description: {
      type: String,
      default: null,
    },
    producer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producer",
      required: [true, "ID proizvođača je obavezan"],
    },
    beer_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BeerType",
      required: [true, "Tip piva je obavezan"],
    },
    beer_color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BeerColor",
      required: [true, "Boja piva je obavezna"],
    },
    alcohol_percentage: {
      type: Number,
      required: [true, "Postotak alkohola je obavezan"],
    },
    ibu: {
      type: Number,
      default: null,
    },
    volume_ml: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      required: [true, "Cijena je obavezna"],
    },
    image_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const BeerModel =
  mongoose.models.Beer || mongoose.model("Beer", BeerSchema, "beers");

module.exports = BeerModel;
