const mongoose = require("mongoose");

const BeerColorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Unesi boju piva"],
      unique: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const BeerColorModel =
  mongoose.models.BeerColor ||
  mongoose.model("BeerColor", BeerColorSchema, "beerColors");

module.exports = BeerColorModel;
