const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { PAGE_NUMBER, PAGE_SIZE } = require("../types/constants");

const getAllUsers = async (req, res) => {
  const { pageNumber, pageSize } = req.query;
  let limit = Number(pageSize) || PAGE_SIZE;
  let page = Number(pageNumber) || PAGE_NUMBER;
  let skip = page * limit;

  const [users, totalCount] = await Promise.all([
    User.find({}).sort("createdAt").skip(skip).limit(limit).exec(),
    User.countDocuments({}),
  ]);

  res.status(StatusCodes.OK).json({
    entities: users,
    pagination: {
      pageNumber: page,
      pageSize: limit,
    },
    totalCount,
  });
};

const getUser = async (req, res) => {
  const {
    params: { id: userId },
  } = req;
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new NotFoundError("Korisnik ne postoji");
  }

  res.status(StatusCodes.OK).json(user);
};

const makeUser = async (req, res) => {
  const user = await User.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Korisnik uspješno kreiran", user });
};

const updateUser = async (req, res) => {
  const {
    body: { username, email, password },
    params: { id: userId },
  } = req;

  if (username === "" || email === "" || password === "") {
    throw new BadRequestError("Polja trebaju biti popunjena");
  }

  const user = await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new NotFoundError("Korisnik ne postoji");
  }

  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findByIdAndDelete({ _id: userId });

  if (!user) {
    throw new NotFoundError("Korisnik ne postoji");
  }

  res.status(StatusCodes.OK).json({ message: "Korisnik uspješno izbrisan" });
};

const changePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword },
    params: { id: userId },
  } = req;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Stara i nova lozinka su obavezni");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("Korisnik ne postoji");
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new BadRequestError("Stara lozinka nije ispravna");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ message: "Lozinka uspješno promijenjena" });
};

module.exports = {
  getAllUsers,
  makeUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
};
