// Format number as INR currency
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return "₹0";
    }

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};
