import API from "./api";

export const getAllMatches = () => API.get("/matches");
export const createMatchRequest = (data) => API.post("/matches", data);
export const getMatchDetails = (id) => API.get(`/matches/${id}`);
export const joinMatch = (id) => API.post(`/matches/${id}/join`);
export const leaveMatch = (id) => API.post(`/matches/${id}/leave`);
export const cancelMatch = (id) => API.delete(`/matches/${id}`);
export const getMyMatches = () => API.get("/matches/my-matches");
