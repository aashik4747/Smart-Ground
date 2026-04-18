import API from "./api";

export const searchGrounds = (query, state = "", city = "") => {
    let url = `/grounds/search?q=${query}`;
    if (state) url += `&state=${encodeURIComponent(state)}`;
    if (city) url += `&city=${encodeURIComponent(city)}`;
    return API.get(url);
};
export const getGroundDetails = (id) => API.get(`/grounds/${id}`);

// Venue Manager
export const addGround = (data) => API.post("/venue-manager/grounds", data);
export const updateGround = (id, data) => API.put(`/venue-manager/grounds/${id}`, data);
export const deleteGround = (id) => API.delete(`/venue-manager/grounds/${id}`);
