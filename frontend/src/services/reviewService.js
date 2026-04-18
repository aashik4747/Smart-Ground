import API from "./api";

// Add a review for a venue
export const addReview = (venueId, rating, comment) => {
    return API.post("/reviews", { venueId, rating, comment });
};

// Get all reviews for a venue
export const getVenueReviews = (venueId) => {
    return API.get(`/reviews/venue/${venueId}`);
};

// Get user's reviews
export const getMyReviews = () => {
    return API.get("/reviews/my-reviews");
};

// Update a review
export const updateReview = (reviewId, rating, comment) => {
    return API.put(`/reviews/${reviewId}`, { rating, comment });
};

// Delete a review
export const deleteReview = (reviewId) => {
    return API.delete(`/reviews/${reviewId}`);
};
