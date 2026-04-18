const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
    createBooking,
    getMyBookings,
    getBookedSlots,
    cancelBooking
} = require("../controllers/bookingController");

router.post("/", auth, createBooking);
router.get("/slots", getBookedSlots);
router.get("/my-bookings", auth, getMyBookings);
router.delete("/:bookingId/cancel", auth, cancelBooking);

module.exports = router;
