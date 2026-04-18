import API from "./api";

// Venue Manager
export const getStallsByVenue = () => API.get("/venue-manager/stalls");
export const updateStallStatus = (id, status) => API.put(`/venue-manager/stalls/${id}/status`, { status });

// Stall Owner
export const requestStall = (data) => API.post("/stalls/request", data);
export const getMyStalls = () => API.get("/stalls/my-stalls");
export const deleteStallRequest = (id) => API.delete(`/stalls/${id}`);
export const getAllStallsAdmin = () => API.get("/stalls/admin/all");
