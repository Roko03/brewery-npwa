const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");
const Beer = require("../models/Beer");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getUserFavorites = async (req, res) => {
  const userId = req.user.userId;

  const favorites = await Favorite.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "beers",
        localField: "beer_id",
        foreignField: "_id",
        as: "beer",
      },
    },
    { $unwind: "$beer" },
    {
      $lookup: {
        from: "producers",
        localField: "beer.producer_id",
        foreignField: "_id",
        as: "producer",
      },
    },
    {
      $lookup: {
        from: "beerTypes",
        localField: "beer.beer_type_id",
        foreignField: "_id",
        as: "beerType",
      },
    },
    {
      $lookup: {
        from: "beerColors",
        localField: "beer.beer_color_id",
        foreignField: "_id",
        as: "beerColor",
      },
    },
    {
      $project: {
        _id: 1,
        beer_id: "$beer._id",
        name: "$beer.name",
        description: "$beer.description",
        producer_name: { $arrayElemAt: ["$producer.name", 0] },
        producer_country: { $arrayElemAt: ["$producer.country", 0] },
        beer_type_name: { $arrayElemAt: ["$beerType.name", 0] },
        beer_color_name: { $arrayElemAt: ["$beerColor.name", 0] },
        alcohol_percentage: "$beer.alcohol_percentage",
        ibu: "$beer.ibu",
        volume_ml: "$beer.volume_ml",
        price: "$beer.price",
        image_url: "$beer.image_url",
        created_at: 1,
      },
    },
    { $sort: { created_at: -1 } },
  ]);

  res.status(StatusCodes.OK).json({
    entities: favorites,
    totalCount: favorites.length,
  });
};

const addFavorite = async (req, res) => {
  const userId = req.user.userId;
  const { beer_id } = req.body;

  if (!beer_id) {
    throw new BadRequestError("Beer ID je obavezan");
  }

  // Check if beer exists
  const beer = await Beer.findById(beer_id);
  if (!beer) {
    throw new NotFoundError("Pivo ne postoji");
  }

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({
    user_id: userId,
    beer_id: beer_id,
  });

  if (existingFavorite) {
    throw new BadRequestError("Pivo je već u omiljenim");
  }

  const favorite = await Favorite.create({
    user_id: userId,
    beer_id: beer_id,
  });

  res.status(StatusCodes.CREATED).json({
    message: "Pivo dodano u omiljene",
    favorite,
  });
};

const removeFavorite = async (req, res) => {
  const userId = req.user.userId;
  const { id: favoriteId } = req.params;

  const favorite = await Favorite.findOneAndDelete({
    _id: favoriteId,
    user_id: userId,
  });

  if (!favorite) {
    throw new NotFoundError("Omiljeno pivo ne postoji");
  }

  res.status(StatusCodes.OK).json({
    message: "Pivo uklonjeno iz omiljenih",
  });
};

const removeFavoriteByBeerId = async (req, res) => {
  const userId = req.user.userId;
  const { beerId } = req.params;

  const favorite = await Favorite.findOneAndDelete({
    beer_id: beerId,
    user_id: userId,
  });

  if (!favorite) {
    throw new NotFoundError("Omiljeno pivo ne postoji");
  }

  res.status(StatusCodes.OK).json({
    message: "Pivo uklonjeno iz omiljenih",
  });
};

const checkFavorite = async (req, res) => {
  const userId = req.user.userId;
  const { beerId } = req.params;

  const favorite = await Favorite.findOne({
    user_id: userId,
    beer_id: beerId,
  });

  res.status(StatusCodes.OK).json({
    isFavorite: !!favorite,
    favoriteId: favorite?._id || null,
  });
};

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  removeFavoriteByBeerId,
  checkFavorite,
};
