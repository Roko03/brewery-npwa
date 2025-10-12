const { UnauthenticatedError } = require("../errors");

const roleAuthentication = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("Korisnik nema ulogu za tu radnju");
    }
    next();
  };
};

module.exports = roleAuthentication;
