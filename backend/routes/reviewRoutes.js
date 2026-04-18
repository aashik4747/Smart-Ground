const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
    addReview,
    getVenueReviews,
    getUserReviews,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

// Add a review for a venue
router.post("/", auth, addReview);

// Get all reviews for a venue (public)
router.get("/venue/:venueId", getVenueReviews);

// Get user's reviews
router.get("/my-reviews", auth, getUserReviews);

// Update a review
router.put("/:reviewId", auth, updateReview);

// Delete a review
router.delete("/:reviewId", auth, deleteReview);

module.exports = router;
