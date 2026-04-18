import API from "./api";

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const verifyOTP = (data) => API.post("/auth/verify-otp", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const logoutUser = () => API.post("/auth/logout");
export const googleLoginUser = (data) => API.post("/auth/google", data);
export const updateTurfIdAPI = (data) => API.put("/auth/turfid", data);
