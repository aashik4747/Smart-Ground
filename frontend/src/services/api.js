import axios from "axios";

const API = axios.create({
    baseURL: "/api", // Uses Vite proxy in dev, relative path in prod
    withCredentials: true, // Send cookies with requests
});

// Add interceptor to include token
API.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// Add interceptor to handle responses and errors globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or unauthorized
            localStorage.removeItem("user");
            // Ideally, use a navigation service or window.location to redirect,
            // but be careful with loops.
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default API;
