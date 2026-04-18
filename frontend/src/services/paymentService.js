import API from "./api";

export const getPaymentReports = () => API.get("/admin/payments");
export const getVenueRevenue = () => API.get("/venue-manager/revenue");
export const getStallPayments = () => API.get("/stalls/payments");
