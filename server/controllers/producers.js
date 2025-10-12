const Producer = require("../models/Producer");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { PAGE_NUMBER, PAGE_SIZE } = require("../types/constants");

const getAllProducers = async (req, res) => {
  const { pageNumber, pageSize } = req.query;
  let limit = Number(pageSize) || PAGE_SIZE;
  let page = Number(pageNumber) || PAGE_NUMBER;
  let skip = page * limit;

  const [producers, totalCount] = await Promise.all([
    Producer.find({}).sort("createdAt").skip(skip).limit(limit).exec(),
    Producer.countDocuments({}),
  ]);

  res.status(StatusCodes.OK).json({
    entities: producers,
    pagination: {
      pageNumber: page,
      pageSize: limit,
    },
    totalCount,
  });
};

const getProducer = async (req, res) => {
  const {
    params: { id: producerId },
  } = req;
  const producer = await Producer.findOne({ _id: producerId });

  if (!producer) {
    throw new NotFoundError("Proizvođač ne postoji");
  }

  res.status(StatusCodes.OK).json(producer);
};

const makeProducer = async (req, res) => {
  const producer = await Producer.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Proizvođač uspješno kreiran", producer });
};

const updateProducer = async (req, res) => {
  const {
    body: { name, country },
    params: { id: producerId },
  } = req;

  if (name === "" || country === "") {
    throw new BadRequestError("Polja trebaju biti popunjena");
  }

  const producer = await Producer.findByIdAndUpdate(
    {
      _id: producerId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!producer) {
    throw new NotFoundError("Proizvođač ne postoji");
  }

  res.status(StatusCodes.OK).json({ producer });
};

const deleteProducer = async (req, res) => {
  const { id: producerId } = req.params;

  const producer = await Producer.findByIdAndDelete({ _id: producerId });

  if (!producer) {
    throw new NotFoundError("Proizvođač ne postoji");
  }

  res.status(StatusCodes.OK).json({ message: "Proizvođač uspješno izbrisan" });
};

module.exports = {
  getAllProducers,
  getProducer,
  makeProducer,
  updateProducer,
  deleteProducer,
};
