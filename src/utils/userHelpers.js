/**
 * Normalize isHead from API / Redux (boolean, number, or string).
 */
export const isHeadUser = (user) => {
  if (!user) return false;
  const value = user.isHead;
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true";
  }
  return false;
};
