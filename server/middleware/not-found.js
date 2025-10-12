const notFoundMiddleware = (req, res) => res.status(404).send("Page not found");

module.exports = notFoundMiddleware;
