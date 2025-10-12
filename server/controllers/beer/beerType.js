const BeerType = require("../../models/BeerType");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllBeerType = async (req, res) => {
  const { color } = req.query;

  const query = color ? { beer_color_id: color } : {};

  const [beerTypes, totalCount] = await Promise.all([
    BeerType.find(query).sort("createdAt"),
    BeerType.countDocuments(query),
  ]);

  res.status(StatusCodes.OK).json({
    entities: beerTypes,
    pagination: {
      pageNumber: 0,
      pageSize: totalCount,
    },
    totalCount,
  });
};

const getBeerType = async (req, res) => {
  const {
    params: { id: beerTypeId },
  } = req;
  const beerType = await BeerType.findOne({ _id: beerTypeId });

  if (!beerType) {
    throw new NotFoundError("Tip piva ne postoji");
  }

  res.status(StatusCodes.OK).json(beerType);
};

const makeBeerType = async (req, res) => {
  const beerType = await BeerType.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Tip piva uspješno kreirana", beerType });
};

const updateBeerType = async (req, res) => {
  const {
    body: { name },
    params: { id: beerTypeId },
  } = req;

  if (name === "") {
    throw new BadRequestError("Polja trebaju biti popunjena");
  }

  const beerType = await BeerType.findByIdAndUpdate(
    {
      _id: beerTypeId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!beerType) {
    throw new NotFoundError("Tip piva ne postoji");
  }

  res.status(StatusCodes.OK).json({ beerType });
};

const deleteBeerType = async (req, res) => {
  const { id: beerTypeId } = req.params;

  const beerType = await BeerType.findByIdAndDelete({ _id: beerTypeId });

  if (!beerType) {
    throw new NotFoundError("Tip piva ne postoji");
  }

  res.status(StatusCodes.OK).json({ message: "Tip piva uspješno izbrisana" });
};

module.exports = {
  getAllBeerType,
  getBeerType,
  makeBeerType,
  updateBeerType,
  deleteBeerType,
};
