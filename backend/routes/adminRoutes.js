const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { validateVenue } = require("../middlewares/validateVenue");
const { checkValidation } = require("../middlewares/validate");

// Test route - no auth required
router.get("/test", (req, res) => {
    res.json({ message: "Admin routes are working" });
});

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", adminController.getDashboardStats);
router.get("/users", adminController.getAllUsers);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/venues", adminController.getAllVenues);
router.post("/venues", validateVenue, checkValidation, adminController.createVenue);
router.put("/venues/:id", adminController.updateVenue);
router.delete("/venues/:id", adminController.deleteVenue);
router.put("/venues/:id/approve", adminController.approveVenue);

// Ground Management (formerly venue manager features)
router.get("/grounds", adminController.getAllGrounds);
router.post("/grounds", adminController.createGround);
router.put("/grounds/:id", adminController.updateGround);
router.delete("/grounds/:id", adminController.deleteGround);
router.get("/venue-manager-stats", adminController.getVenueManagerStats);

router.get("/bookings", adminController.getAllBookings);
router.get("/matches", adminController.getAllMatches);
router.put("/matches/:id/approve", adminController.approveMatch);
router.put("/matches/:id/reject", adminController.rejectMatch);
router.get("/stalls", adminController.getAllStalls);
router.get("/payments", adminController.getAllPayments);

module.exports = router;
