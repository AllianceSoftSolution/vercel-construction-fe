const PETTY_CASH_EXCLUDED_PROJECT_CODES = new Set(["HO-Petty"]);

export const isPettyCashSelectableProject = (project) => {
  if (!project) return false;
  const code = (project.code || "").trim();
  if (PETTY_CASH_EXCLUDED_PROJECT_CODES.has(code)) return false;
  const name = (project.name || "").trim().toLowerCase();
  return name !== "head office petty cash";
};

export const filterPettyCashSelectableProjects = (projects = []) =>
  projects.filter(isPettyCashSelectableProject);
