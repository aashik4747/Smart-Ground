const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const { createPayment } = require("../controllers/paymentController");

router.post("/", auth, createPayment);

module.exports = router;
