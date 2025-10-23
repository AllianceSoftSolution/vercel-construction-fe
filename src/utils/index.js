import moment from 'moment-timezone';

export function formatSessionDateTime({ date, time, timezone, sessionDurationHours = 1, displayTimezone = true }) {
  // Convert the UTC date to the session's timezone
  const zonedDate = moment.tz(date, timezone);

  // Format date (e.g., "27 April 2025")
  const formattedDate = zonedDate.format("D MMMM YYYY");

  // Parse the time (e.g., "12:55")
  const [hours, minutes] = time.split(":").map(Number);

  // Set hours and minutes on the zoned date
  const startDateTime = zonedDate.clone().hours(hours).minutes(minutes);

  // Calculate end time
  const endDateTime = startDateTime.clone().add(sessionDurationHours, 'hours');

  // Format times (e.g., "12:55 PM" and "1:55 PM")
  const formattedStartTime = startDateTime.format("h:mm A");
  const formattedEndTime = endDateTime.format("h:mm A");

  // Get full timezone name like "Asia/Karachi" or "America/New_York"
  const timezoneName = startDateTime.tz();

  const timezoneDisplay = displayTimezone ? ` (${timezoneName})` : "";

  // Final return
  return {
    formattedDate, // e.g., "27 April 2025"
    formattedTimeWithTimezone: `${formattedStartTime} to ${formattedEndTime}${timezoneDisplay}`, // e.g., "12:55 PM to 1:55 PM (Asia/Karachi)"
  };
}

export function formatDateDMY(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d)) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${d.getFullYear()}`;
}

export function formatToK(num) {
  // Handle cases where the input is null, undefined, or not a valid number
  if (num == null || isNaN(num)) {
    return "0"; // Return "0" for invalid inputs
  }

  if (num >= 1_000_000) {
    // If number is greater than or equal to 1 million, format in millions (M)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    // If number is greater than or equal to 1 thousand, format in thousands (K)
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return num?.toString(); // Return the number as a string if it's less than 1000
}
