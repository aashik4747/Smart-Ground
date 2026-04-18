// Calculates total price based on hourly rate and duration
export const calculatePrice = (pricePerHour, hours) => {
    const price = parseFloat(pricePerHour);
    const duration = parseFloat(hours);

    if (isNaN(price) || isNaN(duration)) {
        return 0;
    }

    return Math.round(price * duration);
};
