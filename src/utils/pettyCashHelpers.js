export const HEAD_OFFICE_PETTY_CASH_PROJECT_CODE = "HO-Petty";

export const isHeadOfficePettyCashProject = (project) => {
  if (!project) return false;
  const code = (project.code || "").trim();
  if (code === HEAD_OFFICE_PETTY_CASH_PROJECT_CODE) return true;
  return (project.name || "").trim().toLowerCase() === "head office petty cash";
};

/** All projects, including HO-Petty, are valid distribute/expense targets */
export const isPettyCashOperationalTarget = () => true;

export const filterPettyCashOperationalTargets = (projects = []) =>
  projects.filter(isPettyCashOperationalTarget);

/** @deprecated Use filterPettyCashOperationalTargets */
export const filterPettyCashSelectableProjects = filterPettyCashOperationalTargets;
