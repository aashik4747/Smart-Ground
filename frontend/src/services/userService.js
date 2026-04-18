import API from "./api";

// Admin
export const getAllUsers = () => API.get("/admin/users");
export const updateUserRole = (id, role) => API.put(`/admin/users/${id}`, { role });
export const updateUserStatus = (id, status) => API.put(`/admin/users/${id}/status`, { status });
export const getAdminStats = () => API.get("/admin/stats");

// User
export const getProfile = () => API.get("/users/me").catch(error => {
    console.error("getProfile error:", error);
    console.error("Error response:", error.response);
    console.error("Error message:", error.message);
    throw error;
});
export const setInitialUserRole = (role) => API.post("/users/role", { role });
export const updateProfile = (data) => API.put("/users/me", data);
export const changePassword = (data) => API.put("/users/change-password", data);
