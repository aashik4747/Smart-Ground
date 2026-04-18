import API from "./api";

export const getAllMatches = () => API.get("/matches").then(res => {
    // Backend returns matches directly as array
    return { data: Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []) };
});
export const createMatchRequest = (data) => API.post("/matches", data);
export const getMatchDetails = (id) => API.get(`/matches/${id}`);
export const joinMatch = (id) => API.post(`/matches/${id}/join`);
export const leaveMatch = (id) => API.post(`/matches/${id}/leave`);
export const cancelMatch = (id) => API.delete(`/matches/${id}`);
export const getMyMatches = () => API.get("/matches/my-matches").then(res => {
    // Backend returns matches directly as array
    return { data: Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []) };
});
