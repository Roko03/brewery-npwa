const BeerColor = require("../../models/BeerColor");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllBeerColor = async (req, res) => {
  const [beerColors, totalCount] = await Promise.all([
    BeerColor.find({}).sort("createdAt"),
    BeerColor.countDocuments({}),
  ]);

  res.status(StatusCodes.OK).json({
    entities: beerColors,
    pagination: {
      pageNumber: 0,
      pageSize: totalCount,
    },
    totalCount,
  });
};

const getBeerColor = async (req, res) => {
  const {
    params: { id: beerColorId },
  } = req;
  const beerColor = await BeerColor.findOne({ _id: beerColorId });

  if (!beerColor) {
    throw new NotFoundError("Boja piva ne postoji");
  }

  res.status(StatusCodes.OK).json(beerColor);
};

const makeBeerColor = async (req, res) => {
  const beerColor = await BeerColor.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Boja piva uspješno kreirana", beerColor });
};

const updateBeerColor = async (req, res) => {
  const {
    body: { name },
    params: { id: beerColorId },
  } = req;

  if (name === "") {
    throw new BadRequestError("Polja trebaju biti popunjena");
  }

  const beerColor = await BeerColor.findByIdAndUpdate(
    {
      _id: beerColorId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!beerColor) {
    throw new NotFoundError("Boja piva ne postoji");
  }

  res.status(StatusCodes.OK).json({ beerColor });
};

const deleteBeerColor = async (req, res) => {
  const { id: beerColorId } = req.params;

  const beerColor = await BeerColor.findByIdAndDelete({ _id: beerColorId });

  if (!beerColor) {
    throw new NotFoundError("Boja piva ne postoji");
  }

  res.status(StatusCodes.OK).json({ message: "Boja piva uspješno izbrisana" });
};

module.exports = {
  getAllBeerColor,
  getBeerColor,
  makeBeerColor,
  updateBeerColor,
  deleteBeerColor,
};
