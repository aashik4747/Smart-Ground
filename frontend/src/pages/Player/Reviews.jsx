import { useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useNotification } from "../../context/NotificationContext";

export default function Reviews() {
    const { addNotification } = useNotification();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const submitReview = (e) => {
        e.preventDefault();
        if (rating === 0) {
            addNotification("Please select a star rating", "error");
            return;
        }
        if (!review.trim()) {
            addNotification("Please write a review", "error");
            return;
        }

        // Mock submission
        console.log({ rating, review });
        addNotification("Review submitted successfully!", "success");
        setReview("");
        setRating(0);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
                    <div className="bg-indigo-900 px-8 py-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Rate Your Experience</h2>
                        <p className="text-indigo-200">Share your feedback to help us improve.</p>
                    </div>

                    <form onSubmit={submitReview} className="p-8 md:p-10 space-y-6">
                        <div className="flex flex-col items-center">
                            <label className="text-gray-700 font-semibold mb-3">Overall Rating</label>
                            <div className="flex space-x-2">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <button
                                            type="button"
                                            key={ratingValue}
                                            className={`text-3xl focus:outline-none transition-colors transform hover:scale-110 ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                                                }`}
                                            onClick={() => setRating(ratingValue)}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            ★
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                            <textarea
                                value={review}
                                onChange={e => setReview(e.target.value)}
                                placeholder="Tell us what you liked or what we can do better..."
                                rows="5"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}
