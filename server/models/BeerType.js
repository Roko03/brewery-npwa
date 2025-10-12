const mongoose = require("mongoose");

const BeerTypeSchema = new mongoose.Schema(
  {
    beer_color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BeerColor",
      required: [true, "Boja piva je obavezna"],
    },
    name: {
      type: String,
      required: [true, "Unesi tip piva"],
      unique: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const BeerTypeModel =
  mongoose.models.BeerType ||
  mongoose.model("BeerType", BeerTypeSchema, "beerTypes");

module.exports = BeerTypeModel;
