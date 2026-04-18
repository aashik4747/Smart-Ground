import api from "./api";

export const getAdminStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getAllUsers = async (role) => {
    const url = role ? `/admin/users?role=${role}` : `/admin/users`;
    const response = await api.get(url);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
};

export const getAllVenues = async () => {
    const response = await api.get('/admin/venues');
    return response.data;
};

export const createVenue = async (data) => {
    const response = await api.post('/admin/venues', data);
    return response.data;
};

export const updateVenue = async (id, data) => {
    const response = await api.put(`/admin/venues/${id}`, data);
    return response.data;
};

export const deleteVenue = async (id) => {
    const response = await api.delete(`/admin/venues/${id}`);
    return response.data;
};

export const approveVenue = async (id) => {
    const response = await api.put(`/admin/venues/${id}/approve`);
    return response.data;
};

export const getAllBookings = async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
};

export const getAllMatches = async () => {
    const response = await api.get('/admin/matches');
    return response.data;
};

export const approveMatch = async (id) => {
    const response = await api.put(`/admin/matches/${id}/approve`);
    return response.data;
};

export const rejectMatch = async (id) => {
    const response = await api.put(`/admin/matches/${id}/reject`);
    return response.data;
};

export const getAllStalls = async () => {
    const response = await api.get('/admin/stalls');
    return response.data;
};

export const getAllPayments = async () => {
    const response = await api.get('/admin/payments');
    return response.data;
};

// Ground Management (formerly venue manager features)
export const getAllGrounds = async () => {
    const response = await api.get('/admin/grounds');
    return response.data;
};

export const createGround = async (data) => {
    const response = await api.post('/admin/grounds', data);
    return response.data;
};

export const updateGround = async (id, data) => {
    const response = await api.put(`/admin/grounds/${id}`, data);
    return response.data;
};

export const deleteGround = async (id) => {
    const response = await api.delete(`/admin/grounds/${id}`);
    return response.data;
};

export const getVenueManagerStats = async () => {
    const response = await api.get('/admin/venue-manager-stats');
    return response.data;
};
