const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    versionKey: false,
  }
);

FavoriteSchema.index({ user_id: 1, beer_id: 1 }, { unique: true });

const FavoriteModel =
  mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema, "favorites");

module.exports = FavoriteModel;
