/** Privileged Super Admin who can set passwords on user create and fully edit/delete users. */
export const PRIVILEGED_SUPER_ADMIN_EMAIL = "allianceadmin@gmail.com";

/** Public label shown instead of the privileged Super Admin's real identity. */
export const SYSTEM_ADMIN_DISPLAY_NAME = "System Admin";

export const isPrivilegedSuperAdminEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase() === PRIVILEGED_SUPER_ADMIN_EMAIL;

export const isPrivilegedSuperAdmin = (user) => {
  if (!user?.email) return false;
  if (!isPrivilegedSuperAdminEmail(user.email)) return false;
  const role = user.originalRole || user.role;
  return role === "SUPER_ADMIN" || role === "ADMIN";
};

/** Display name for Created By / actor columns. */
export const getCreatorDisplayName = (creator, fallback = "-") => {
  if (!creator) return fallback;
  if (
    isPrivilegedSuperAdminEmail(creator.email) ||
    creator.name === SYSTEM_ADMIN_DISPLAY_NAME
  ) {
    return SYSTEM_ADMIN_DISPLAY_NAME;
  }
  return creator.name || creator.email || fallback;
};

export const getHiddenRolesForDashboard = (viewerRole) => {
  const role = String(viewerRole || "").toUpperCase();
  if (role === "SUPER_ADMIN") return ["SUPER_ADMIN"];
  if (role === "ADMIN" || role === "SUB_ADMIN") {
    return ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"];
  }
  return [];
};

export const filterUsersByRoleForDashboard = (entries = [], viewerRole) => {
  const hidden = new Set(getHiddenRolesForDashboard(viewerRole));
  if (hidden.size === 0) return entries;
  return entries.filter(
    (entry) => !hidden.has(String(entry.role || "").toUpperCase()),
  );
};

/** Hide privileged Super Admin from user lists for non-privileged viewers. */
export const filterHiddenPrivilegedUsers = (users = [], viewer) => {
  if (isPrivilegedSuperAdmin(viewer)) return users;
  return users.filter((user) => !isPrivilegedSuperAdminEmail(user?.email));
};
