import moment from "moment/moment";

class DateHelper {
  constructor(date) {
    this.date = moment(date);
  }

  addYears(years) {
    this.date.add(years, "years");
    return this;
  }

  subtractYears(years) {
    this.date.subtract(years, "years");
    return this;
  }

  addMonths(months) {
    this.date.add(months, "months");
    return this;
  }

  subtractMonths(months) {
    this.date.subtract(months, "months");
    return this;
  }

  addDays(days) {
    this.date.add(days, "days");
    return this;
  }

  subtractDays(days) {
    this.date.subtract(days, "days");
    return this;
  }

  addHours(hours) {
    this.date.add(hours, "hours");
    return this;
  }

  subtractHours(hours) {
    this.date.subtract(hours, "hours");
    return this;
  }

  addMinutes(minutes) {
    this.date.add(minutes, "minutes");
    return this;
  }

  subtractMinutes(minutes) {
    this.date.subtract(minutes, "minutes");
    return this;
  }

  addSeconds(seconds) {
    this.date.add(seconds, "seconds");
    return this;
  }

  subtractSeconds(seconds) {
    this.date.subtract(seconds, "seconds");
    return this;
  }

  toDate() {
    return this.date.toDate();
  }
}
function formatDate(date, format = "YYYY-MM-DD") {
  return moment(date).format(format);
}
function createFormData(data) {
  const formData = new FormData();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      if (Array.isArray(value)) {
        for (const item of value) {
          formData.append(key, item);
        }
      } else if (value instanceof FileList) {
        for (const item of value) {
          formData.append(key, item);
        }
      } else if (typeof value === "Object") {
        formData.append(key, JSON.stringify(value));
      } else value && formData.append(key, value);
    }
  }

  return formData;
}
function objectToQueryString(obj) {
  return Object.keys(obj)
    .filter((key) => obj[key])
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
}

const getCurrentURLParameters = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};
const getURLQuery = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};
const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};
const getRandomColor = () => {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;
};
const getAsBool = (value) => {
  return value == "true" || value == "True";
};
const formattedPrice = (price) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD", // Adjust the currency code as needed
    minimumFractionDigits: 0,
  });
};
function TypeCheck(value) {
  return {
    isUndefined: () => typeof value === "undefined",
    isNull: () => value === null,
    isBoolean: () => typeof value === "boolean",
    isNumber: () => typeof value === "number",
    isString: () => typeof value === "string",
    isObject: () => typeof value === "object",
    isArray: () => Array.isArray(value),
    isObjectNotArray: () => typeof value === "object" && !Array.isArray(value),
    isFunction: () => typeof value === "function",
    isSymbol: () => typeof value === "symbol",
    isBigInt: () => typeof value === "bigint",
  };
}

const extractId = (dataObj) => {
  if (TypeCheck().isObjectNotArray(dataObj)) return dataObj._id;
  else return dataObj;
};
const ChangedValues = (initialValues, currentValues) => {
  return Object.keys(currentValues).reduce((acc, key) => {
    if (currentValues[key] !== initialValues[key]) {
      acc[key] = currentValues[key];
    }
    return acc;
  }, {});
};
const formatToK = (num) => {
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
};

function formatUnixTimestamp(timestamp) {
  // Convert the Unix timestamp to milliseconds and create a new Date object
  const date = new Date(timestamp * 1000);

  // Format the date in YYYY-MM-DD format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero for single-digit days

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const getTimeElapsed = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMinutes = Math.floor((now - past) / 60000);

  if (diffInMinutes < 2) return "Now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays <= 7) return `${diffInDays} days ago`;

  return past.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const mergeNotifications = (existingNotifications, newNotifications) => {
  const notificationMap = new Map();

  // Add existing notifications to the map by id
  existingNotifications.forEach((notif) => {
    notificationMap.set(notif.id, notif);
  });

  // Add or update notifications based on id
  newNotifications.forEach((notif) => {
    notificationMap.set(notif.id, notif); // This will update if id exists, add if it doesn't
  });

  // Convert the map back to an array, preserving unique notifications with the latest data
  return Array.from(notificationMap.values());
};

export {
  createFormData,
  DateHelper,
  formatDate,
  objectToQueryString,
  getCurrentURLParameters,
  copyToClipboard,
  getRandomColor,
  getAsBool,
  formattedPrice,
  TypeCheck,
  extractId,
  ChangedValues,
  formatToK,
  formatUnixTimestamp,
  getTimeElapsed,
  mergeNotifications,
};
