const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // Try to get token from cookies first
  let token = req.cookies.accessToken;

  // If not in cookies, try Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    throw new UnauthenticatedError("Korisnik nije verificiran");
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ _id: payload.userId });
    req.user = user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Korisnik nije verificiran");
  }
};

module.exports = auth;
