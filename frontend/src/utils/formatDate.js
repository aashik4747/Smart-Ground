// Format date to "12 October 2023"
export const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Format time to "10:30 AM"
export const formatTime = (timeString) => {
    if (!timeString) return "";
    // Check if it's already in HH:MM format (simple check)
    if (timeString.includes(":") && timeString.length <= 5) {
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }

    // If it's a full date string
    return new Date(timeString).toLocaleTimeString("en-IN", {
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Format date and time
export const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${formatDate(date)} at ${formatTime(date)}`;
};
