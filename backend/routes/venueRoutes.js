const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
    getVenues,
    approveVenue,
    getAllVenuesAdmin,
    getVenueById,
    getAvailableSlots,
    createVenue,
    updateVenue,
    deleteVenue,
    getMyVenues
} = require("../controllers/venueController");

// Public routes
router.get("/", getVenues);
router.get("/:id", getVenueById);
router.get("/:venueId/slots/:date", getAvailableSlots);

// Manager routes
router.post("/", auth, role("manager"), upload.array('images', 10), createVenue);
router.put("/:id", auth, role("manager"), upload.array('images', 10), updateVenue);
router.delete("/:id", auth, role("manager"), deleteVenue);
router.get("/my-venues", auth, role("manager"), getMyVenues);

// Admin routes
router.get("/admin/all", auth, role("admin"), getAllVenuesAdmin);
router.put("/:id/approve", auth, role("admin"), approveVenue);

module.exports = router;
