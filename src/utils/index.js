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
