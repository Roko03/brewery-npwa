const mongoose = require("mongoose");
const Beer = require("../../models/Beer");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const { PAGE_NUMBER, PAGE_SIZE } = require("../../types/constants");

const getAllBeers = async (req, res) => {
  const { producer, type, color, pageNumber, pageSize } = req.query;
  let limit = Number(pageSize) || PAGE_SIZE;
  let page = Number(pageNumber) || PAGE_NUMBER;
  let skip = page * limit;

  const matchStage = {};
  if (producer) matchStage.producer_id = new mongoose.Types.ObjectId(producer);
  if (type) matchStage.beer_type_id = new mongoose.Types.ObjectId(type);
  if (color) matchStage.beer_color_id = new mongoose.Types.ObjectId(color);

  const [result] = await Beer.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "producers",
        localField: "producer_id",
        foreignField: "_id",
        as: "producer",
      },
    },
    {
      $lookup: {
        from: "beerTypes",
        localField: "beer_type_id",
        foreignField: "_id",
        as: "beerType",
      },
    },
    {
      $lookup: {
        from: "beerColors",
        localField: "beer_color_id",
        foreignField: "_id",
        as: "beerColor",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        producer_id: 1,
        producer_name: { $arrayElemAt: ["$producer.name", 0] },
        producer_country: { $arrayElemAt: ["$producer.country", 0] },
        beer_type_id: 1,
        beer_type_name: { $arrayElemAt: ["$beerType.name", 0] },
        beer_color_id: 1,
        beer_color_name: { $arrayElemAt: ["$beerColor.name", 0] },
        alcohol_percentage: 1,
        ibu: 1,
        volume_ml: 1,
        price: 1,
        image_url: 1,
        created_at: 1,
        updated_at: 1,
      },
    },
    { $sort: { created_at: 1 } },
    {
      $facet: {
        beers: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const beers = result.beers || [];
  const totalCount = result.totalCount[0]?.count || 0;

  res.status(StatusCodes.OK).json({
    entities: beers,
    pagination: {
      pageNumber: page,
      pageSize: limit,
    },
    totalCount,
  });
};

const getBeer = async (req, res) => {
  const {
    params: { id: beerId },
  } = req;

  const [beer] = await Beer.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(beerId) } },
    {
      $lookup: {
        from: "producers",
        localField: "producer_id",
        foreignField: "_id",
        as: "producer",
      },
    },
    {
      $lookup: {
        from: "beerTypes",
        localField: "beer_type_id",
        foreignField: "_id",
        as: "beerType",
      },
    },
    {
      $lookup: {
        from: "beerColors",
        localField: "beer_color_id",
        foreignField: "_id",
        as: "beerColor",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        producer_id: 1,
        producer_name: { $arrayElemAt: ["$producer.name", 0] },
        producer_country: { $arrayElemAt: ["$producer.country", 0] },
        beer_type_id: 1,
        beer_type_name: { $arrayElemAt: ["$beerType.name", 0] },
        beer_color_id: 1,
        beer_color_name: { $arrayElemAt: ["$beerColor.name", 0] },
        alcohol_percentage: 1,
        ibu: 1,
        volume_ml: 1,
        price: 1,
        image_url: 1,
        created_at: 1,
        updated_at: 1,
      },
    },
  ]);

  if (!beer) {
    throw new NotFoundError("Pivo ne postoji");
  }

  res.status(StatusCodes.OK).json(beer);
};

const makeBeer = async (req, res) => {
  const beer = await Beer.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Pivo uspješno kreirano", beer });
};

const updateBeer = async (req, res) => {
  const {
    body,
    params: { id: beerId },
  } = req;

  if (!body.name || body.name === "") {
    throw new BadRequestError("Ime piva je obavezno");
  }

  const beer = await Beer.findByIdAndUpdate({ _id: beerId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!beer) {
    throw new NotFoundError("Pivo ne postoji");
  }

  res.status(StatusCodes.OK).json({ beer });
};

const deleteBeer = async (req, res) => {
  const { id: beerId } = req.params;

  const beer = await Beer.findByIdAndDelete({ _id: beerId });

  if (!beer) {
    throw new NotFoundError("Pivo ne postoji");
  }

  res.status(StatusCodes.OK).json({ message: "Pivo uspješno izbrisano" });
};

module.exports = {
  getAllBeers,
  getBeer,
  makeBeer,
  updateBeer,
  deleteBeer,
};
