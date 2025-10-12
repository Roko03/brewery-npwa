require("dotenv").config();
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  const accessToken = user.genereteAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.status(StatusCodes.CREATED).json({
    user_id: user.id,
    accessToken,
    refreshToken,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Molimo unesite email i šifru");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Korisnik sa unesenim emailom ne postoji");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Netočna šifra");
  }

  const accessToken = user.genereteAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.status(StatusCodes.OK).json({
    user_id: user.id,
    accessToken,
    refreshToken,
  });
};

const logout = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    throw new BadRequestError("Potreban vam je token");
  }

  res
    .status(StatusCodes.NO_CONTENT)
    .json({ message: "Token uspješno izbrisan" });
};

module.exports = {
  register,
  login,
  logout,
};
