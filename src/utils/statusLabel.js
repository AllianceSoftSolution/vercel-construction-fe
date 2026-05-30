export const formatStatusLabel = (status) => {
  if (!status) return "-";

  const normalizedStatus = status.toString().toUpperCase();
  if (normalizedStatus === "IN_STORE") {
    return "Partially completed";
  }

  return normalizedStatus
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
