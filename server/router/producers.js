const express = require("express");
const router = express.Router();

const {
  makeProducer,
  getAllProducers,
  getProducer,
  updateProducer,
  deleteProducer,
} = require("../controllers/producers");

router.route("/").get(getAllProducers).post(makeProducer);
router
  .route("/:id")
  .get(getProducer)
  .put(updateProducer)
  .delete(deleteProducer);

module.exports = router;
