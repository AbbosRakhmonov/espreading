// Format date to Tashkent timezone (UTC+5)
export const formatDateTashkent = (date, options = {}) => {
  if (!date) return "N/A";
  
  try {
    const dateObj = new Date(date);
    
    // Use Intl.DateTimeFormat with Asia/Tashkent timezone
    const defaultOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Tashkent",
      hour12: false,
      ...options,
    };
    
    return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

// Format date only (without time)
export const formatDateOnlyTashkent = (date) => {
  if (!date) return "N/A";
  try {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Tashkent",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

// Format time only
export const formatTimeOnlyTashkent = (date) => {
  if (!date) return "N/A";
  try {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Tashkent",
      hour12: false,
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "N/A";
  }
};

