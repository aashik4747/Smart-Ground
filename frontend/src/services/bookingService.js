import API from "./api";

// Admin
export const getAllBookings = () => API.get("/admin/bookings");

// User
export const bookSlot = (data) => API.post(`/bookings`, data);
export const getMyBookings = () => API.get("/bookings/my-bookings").then(res => {
    // Backend returns { success: true, bookings }
    return { data: res.data?.bookings || [] };
});
export const getBookedSlots = (venueId, date) => API.get(`/bookings/slots?venueId=${venueId}&date=${date}`);
export const cancelBooking = (bookingId) => API.delete(`/bookings/${bookingId}/cancel`);
