import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Chip, Modal, Tab, Tabs } from "@mui/material";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  AccountBalance,
  Payments,
  TrendingDown,
  Wallet,
} from "@mui/icons-material";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import CustomTextField from "../../../mui/CustomTextField";
import Button from "../../../components/Button";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import apiClient from "../../../api/apiClient";
import { formatDateDMY } from "../../../utils";
import { useReadOnly } from "../../../context/ReadOnlyContext";
import { isHeadUser } from "../../../utils/userHelpers";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "560px",
  boxShadow: 24,
  borderRadius: "16px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const TYPE_LABELS = {
  FUNDING: "Funding",
  DISTRIBUTION: "Distribution",
  INTERNAL_EXPENSE: "Internal Expense",
  SECTION_EXPENSE: "Section Expense",
};

const TYPE_LABEL_TO_API = Object.fromEntries(
  Object.entries(TYPE_LABELS).map(([k, v]) => [v, k])
);

const TYPE_CHIP_COLOR = {
  FUNDING: "success",
  DISTRIBUTION: "info",
  INTERNAL_EXPENSE: "warning",
  SECTION_EXPENSE: "error",
};

const formatCurrency = (n) =>
  `Rs. ${Number(n || 0).toLocaleString("en-PK", { minimumFractionDigits: 0 })}`;

const TypeChip = ({ value }) => {
  const label = TYPE_LABELS[value] || value || "-";
  return (
    <Chip
      label={label}
      size="small"
      color={TYPE_CHIP_COLOR[value] || "default"}
      sx={{ fontWeight: 600 }}
    />
  );
};

const ProofLink = ({ value }) =>
  value ? (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline text-sm"
    >
      View
    </a>
  ) : (
    <span className="text-gray-400">-</span>
  );

const PettyCashModule = () => {
  const user = useSelector((s) => s.auth.user);
  const isReadOnly = useReadOnly();

  const isHeadOffice = useMemo(
    () =>
      ["ADMIN", "SUPER_ADMIN", "SUB_ADMIN"].includes(user?.role) ||
      (user?.role === "ACCOUNTANT" && isHeadUser(user)),
    [user]
  );

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectBalance, setProjectBalance] = useState(null);
  const [apiFilters, setApiFilters] = useState({});
  const [filter, setFilter] = useState({ Type: [], Project: [], Section: [] });
  const [activeTab, setActiveTab] = useState(0);

  const [modal, setModal] = useState(null);
  const [addType, setAddType] = useState("FUNDING");
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [headForm, setHeadForm] = useState({ name: "", description: "" });
  const [projectAccountants, setProjectAccountants] = useState([]);

  const permissions = useMemo(
    () => ({
      canAddFunding: summary?.canAddFunding ?? isHeadOffice,
      canManageHeads: summary?.canManageHeads ?? isHeadOffice,
      canDistribute: summary?.canDistribute ?? isHeadOffice,
      canAddInternalExpense: summary?.canAddInternalExpense ?? isHeadOffice,
      canAddSectionExpense: summary?.canAddSectionExpense ?? isHeadOffice,
    }),
    [summary, isHeadOffice]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, projRes, txRes, headsRes, allProjRes, allSecRes] =
        await Promise.all([
          apiClient.get("/petty-cash/summary"),
          apiClient.get("/petty-cash/summary/by-project"),
          apiClient.get("/petty-cash/transactions", {
            projectId: selectedProject?.id,
            ...apiFilters,
          }),
          apiClient.get("/petty-cash/expense-heads"),
          apiClient.get("/projects"),
          apiClient.get("/sections"),
        ]);

      if (sumRes.ok) {
        setSummary(sumRes.data?.data || sumRes.data);
      } else {
        toast.error(
          sumRes.data?.message ||
            "Could not load petty cash summary. Ensure database tables are migrated."
        );
      }

      if (projRes.ok) setProjects(projRes.data?.data || []);
      if (txRes.ok) setTransactions(txRes.data?.data || []);
      if (headsRes.ok) setExpenseHeads(headsRes.data?.data || []);
      if (allProjRes.ok)
        setAllProjects(allProjRes.data?.projects || allProjRes.data?.data || []);
      if (allSecRes.ok)
        setAllSections(allSecRes.data?.sections || allSecRes.data?.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load petty cash data");
    } finally {
      setLoading(false);
    }
  }, [selectedProject?.id, apiFilters]);

  const fetchProjectBalance = useCallback(async (projectId) => {
    const res = await apiClient.get(`/petty-cash/projects/${projectId}/balance`);
    if (res.ok) setProjectBalance(res.data?.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedProject?.id) fetchProjectBalance(selectedProject.id);
  }, [selectedProject, fetchProjectBalance]);

  const sectionsForProject = useMemo(() => {
    if (!form.projectId) return [];
    return allSections.filter((s) => s.projectId === form.projectId);
  }, [form.projectId, allSections]);

  const openModal = async (type, defaults = {}) => {
    setForm(defaults);
    setFile(null);
    setModal(type);
    if (type === "add") {
      setAddType("FUNDING");
    }
    if (defaults.projectId) {
      const res = await apiClient.get(
        `/petty-cash/projects/${defaults.projectId}/accountants`
      );
      if (res.ok) setProjectAccountants(res.data?.data || []);
    }
  };

  const closeModal = () => {
    setModal(null);
    setForm({});
    setFile(null);
    setAddType("FUNDING");
    setHeadForm({ name: "", description: "" });
  };

  const handleSubmitAdd = async () => {
    if (!form.projectId) return toast.error("Select a project");
    if (!form.amount || Number(form.amount) <= 0)
      return toast.error("Enter a valid amount");

    if (addType === "INTERNAL") {
      if (!form.expenseHeadId) return toast.error("Select expense head");
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("projectId", form.projectId);
      fd.append("amount", form.amount);
      if (form.description) fd.append("description", form.description);
      if (file) fd.append("proofOfExpense", file);

      let endpoint = "/petty-cash/funding";
      if (addType === "INTERNAL") {
        endpoint = "/petty-cash/internal-expense";
        fd.append("expenseHeadId", form.expenseHeadId);
      }

      const res = await apiClient.post(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.ok) {
        toast.success(
          addType === "FUNDING"
            ? "Petty cash added successfully"
            : "Internal expense recorded"
        );
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else {
        toast.error(res.data?.message || "Failed to save");
      }
    } catch {
      toast.error("Error saving petty cash");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDistribution = async () => {
    if (!form.projectId) return toast.error("Select a project");
    if (!form.amount || Number(form.amount) <= 0)
      return toast.error("Enter a valid amount");
    setSubmitting(true);
    try {
      const res = await apiClient.post("/petty-cash/distribution", {
        projectId: form.projectId,
        sectionId: form.sectionId || null,
        recipientUserId: form.recipientUserId || user?.id,
        amount: form.amount,
        description: form.description,
      });
      if (res.ok) {
        toast.success("Distribution recorded");
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else toast.error(res.data?.message || "Failed");
    } catch {
      toast.error("Error distributing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSectionExpense = async () => {
    if (!form.projectId || !form.sectionId)
      return toast.error("Select project and section");
    if (!form.expenseHeadId) return toast.error("Select expense head");
    if (!form.amount || Number(form.amount) <= 0)
      return toast.error("Enter a valid amount");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("projectId", form.projectId);
      fd.append("sectionId", form.sectionId);
      fd.append("expenseHeadId", form.expenseHeadId);
      fd.append("amount", form.amount);
      if (form.description) fd.append("description", form.description);
      if (file) fd.append("proofOfExpense", file);
      const res = await apiClient.post("/petty-cash/section-expense", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.ok) {
        toast.success("Section expense recorded");
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else toast.error(res.data?.message || "Failed");
    } catch {
      toast.error("Error recording section expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddHead = async () => {
    if (!headForm.name.trim()) return toast.error("Name required");
    setSubmitting(true);
    try {
      const res = await apiClient.post("/petty-cash/expense-heads", headForm);
      if (res.ok) {
        toast.success("Expense head added");
        setHeadForm({ name: "", description: "" });
        const headsRes = await apiClient.get("/petty-cash/expense-heads");
        if (headsRes.ok) setExpenseHeads(headsRes.data?.data || []);
      } else toast.error(res.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHead = async (id) => {
    const res = await apiClient.delete(`/petty-cash/expense-heads/${id}`);
    if (res.ok) {
      toast.success("Deleted");
      const headsRes = await apiClient.get("/petty-cash/expense-heads");
      if (headsRes.ok) setExpenseHeads(headsRes.data?.data || []);
    }
  };

  const tableData = transactions.map((tx) => ({
    id: tx.id,
    date: formatDateDMY(tx.createdAt),
    type: TYPE_LABELS[tx.type] || tx.type,
    typeRaw: tx.type,
    project: tx.project?.name || "-",
    section: tx.section?.name || "-",
    head: tx.expenseHead?.name || "-",
    amount: formatCurrency(tx.amount),
    recipient: tx.recipient?.name || "-",
    createdBy: tx.creator?.name || "-",
    description: tx.description || "-",
    proof: tx.proofUrl,
  }));

  const columns = [
    { headerName: "Date", field: "date" },
    { headerName: "Type", field: "typeRaw" },
    { headerName: "Project", field: "project" },
    { headerName: "Section", field: "section" },
    { headerName: "Expense Head", field: "head" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Recipient", field: "recipient" },
    { headerName: "By", field: "createdBy" },
    { headerName: "Note", field: "description" },
    { headerName: "Proof", field: "proof" },
  ];

  const cellComponents = {
    typeRaw: TypeChip,
    proof: ProofLink,
  };

  const sectionOptions = useMemo(
    () => [...new Set(allSections.map((s) => s.name).filter(Boolean))],
    [allSections]
  );

  const projectOptions = useMemo(
    () => [...new Set(allProjects.map((p) => p.name).filter(Boolean))],
    [allProjects]
  );

  const filterConfig = [
    { label: "Type", options: Object.values(TYPE_LABELS) },
    { label: "Project", options: projectOptions },
    { label: "Section", options: sectionOptions },
  ];

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
    const next = {};
    if (newSelected.Type?.length) {
      next.type = TYPE_LABEL_TO_API[newSelected.Type[0]];
    }
    if (newSelected.Project?.length) {
      const proj = allProjects.find((p) => p.name === newSelected.Project[0]);
      if (proj) next.projectId = proj.id;
    }
    if (newSelected.Section?.length) {
      const sec = allSections.find((s) => s.name === newSelected.Section[0]);
      if (sec) next.sectionId = sec.id;
    }
    setApiFilters(next);
  };

  const handleFilterClear = () => {
    setFilter({ Type: [], Project: [], Section: [] });
    setApiFilters({});
  };

  if (loading && !summary && projects.length === 0) return <Loader />;

  return (
    <div className="p-4 md:p-6">
      <TopBar
        title="Petty Cash"
        buttonText={
          !isReadOnly && permissions.canAddFunding ? "Add Petty Cash" : ""
        }
        onButtonClick={() =>
          openModal("add", { projectId: selectedProject?.id })
        }
      />

      <div className="flex flex-row flex-wrap items-center justify-end gap-2 sm:gap-3 mt-2 mb-4">
        <CustomFilterDropdown
          filters={filterConfig}
          selected={filter}
          onChange={handleFilterChange}
          onClear={handleFilterClear}
          placeholder="Filter by type, project or section"
          dropdownAlign="right"
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <AnalyticsCard
          icon={Wallet}
          label="Total Funded"
          count={formatCurrency(summary?.totalFunded)}
          countColor="#0252AD"
        />
        <AnalyticsCard
          icon={Payments}
          label="Distributed"
          count={formatCurrency(summary?.totalDistributed)}
          countColor="#8b5cf6"
        />
        <AnalyticsCard
          icon={TrendingDown}
          label="Total Spent"
          count={formatCurrency(summary?.totalSpent)}
          countColor="#ef4444"
        />
        <AnalyticsCard
          icon={AccountBalance}
          label="Pool Remaining"
          count={formatCurrency(summary?.poolRemaining)}
          countColor="#22c55e"
        />
      </div>

      {/* Secondary actions */}
      {!isReadOnly && (
        <div className="flex flex-wrap gap-3 mb-6">
          {permissions.canDistribute && (
            <Button
              buttonText="Distribute to Section"
              onClick={() =>
                openModal("distribution", { projectId: selectedProject?.id })
              }
              className="bg-indigo-600"
            />
          )}
          {permissions.canAddSectionExpense && (
            <Button
              buttonText="Section Expense"
              onClick={() =>
                openModal("sectionExpense", { projectId: selectedProject?.id })
              }
              className="bg-rose-600"
            />
          )}
          {permissions.canManageHeads && (
            <Button
              buttonText="Manage Expense Heads"
              onClick={() => openModal("heads")}
              className="bg-gray-600"
            />
          )}
        </div>
      )}

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} className="mb-4">
        <Tab label="By Project" />
        <Tab label="All Transactions" />
      </Tabs>

      {activeTab === 0 && (
        <div>
          {selectedProject ? (
            <div>
              <button
                className="flex items-center gap-1 text-primary mb-4 font-medium"
                onClick={() => {
                  setSelectedProject(null);
                  setProjectBalance(null);
                }}
              >
                <FiChevronLeft /> Back to projects
              </button>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                {!isReadOnly && permissions.canAddFunding && (
                  <Button
                    buttonText="Add Petty Cash"
                    onClick={() =>
                      openModal("add", { projectId: selectedProject.id })
                    }
                  />
                )}
              </div>
              {projectBalance && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Funded</p>
                    <p className="font-bold">
                      {formatCurrency(projectBalance.totalFunded)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Distributed</p>
                    <p className="font-bold">
                      {formatCurrency(projectBalance.totalDistributed)}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Internal Expenses</p>
                    <p className="font-bold">
                      {formatCurrency(projectBalance.totalInternalExpenses)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Pool Remaining</p>
                    <p className="font-bold">
                      {formatCurrency(projectBalance.projectPoolRemaining)}
                    </p>
                  </div>
                </div>
              )}
              {projectBalance?.sections?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Section Balances</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projectBalance.sections.map((s) => (
                      <div key={s.id} className="border rounded-lg p-3">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-gray-500">
                          Received: {formatCurrency(s.received)} | Spent:{" "}
                          {formatCurrency(s.spent)}
                        </p>
                        <p className="text-sm font-bold text-green-700">
                          Remaining: {formatCurrency(s.remaining)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <SimpleTable
                data={tableData.filter(
                  (r) => r.project === selectedProject.name
                )}
                columns={columns}
                cellComponents={cellComponents}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow bg-white"
                  onClick={() => setSelectedProject(p)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.code}</p>
                    </div>
                    <FiChevronRight className="text-gray-400 mt-1" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Funded</span>
                      <p className="font-semibold">
                        {formatCurrency(p.totalFunded)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Remaining</span>
                      <p className="font-semibold text-green-700">
                        {formatCurrency(p.projectPoolRemaining)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="col-span-full text-center py-12 border rounded-xl bg-gray-50">
                  <p className="text-gray-600 mb-4">No projects found.</p>
                  {!isReadOnly && permissions.canAddFunding && (
                    <Button
                      buttonText="Add Petty Cash to a Project"
                      onClick={() => openModal("add")}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <SimpleTable
          data={tableData}
          columns={columns}
          cellComponents={cellComponents}
        />
      )}

      {/* Unified Add Petty Cash Modal */}
      <Modal open={modal === "add"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Add Petty Cash</h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Type *</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer border rounded-lg p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="addType"
                    checked={addType === "FUNDING"}
                    onChange={() => setAddType("FUNDING")}
                  />
                  <div>
                    <p className="font-medium">Add to Project Pool</p>
                    <p className="text-xs text-gray-500">
                      Fund petty cash for a project (select project, amount,
                      proof)
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer border rounded-lg p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="addType"
                    checked={addType === "INTERNAL"}
                    onChange={() => setAddType("INTERNAL")}
                  />
                  <div>
                    <p className="font-medium">Internal Expense</p>
                    <p className="text-xs text-gray-500">
                      Record internal project spend (expense head, amount,
                      proof)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <label className="text-sm font-medium">Project *</label>
            <select
              className="border rounded p-2"
              value={form.projectId || ""}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Select project</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {addType === "INTERNAL" && (
              <>
                <label className="text-sm font-medium">Expense Head *</label>
                <select
                  className="border rounded p-2"
                  value={form.expenseHeadId || ""}
                  onChange={(e) =>
                    setForm({ ...form, expenseHeadId: e.target.value })
                  }
                >
                  <option value="">Select head</option>
                  {expenseHeads.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
                {expenseHeads.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No expense heads yet. Add them via &quot;Manage Expense
                    Heads&quot;.
                  </p>
                )}
              </>
            )}

            <CustomTextField
              label="Amount *"
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <CustomTextField
              label="Note"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div>
              <label className="text-sm font-medium">Proof (optional)</label>
              <input
                type="file"
                className="border rounded p-2 w-full mt-1"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <p className="text-xs text-gray-400">Date is recorded automatically.</p>
            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-800"
              />
              <Button
                buttonText={submitting ? "Saving..." : "Save"}
                onClick={handleSubmitAdd}
                className="flex-1"
                disabled={submitting}
              />
            </div>
          </div>
        </Box>
      </Modal>

      {/* Distribution Modal */}
      <Modal open={modal === "distribution"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Distribute Petty Cash</h2>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Project *</label>
            <select
              className="border rounded p-2"
              value={form.projectId || ""}
              onChange={async (e) => {
                const projectId = e.target.value;
                setForm({
                  ...form,
                  projectId,
                  sectionId: "",
                  recipientUserId: "",
                });
                if (projectId) {
                  const res = await apiClient.get(
                    `/petty-cash/projects/${projectId}/accountants`
                  );
                  if (res.ok) setProjectAccountants(res.data?.data || []);
                }
              }}
            >
              <option value="">Select project</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <label className="text-sm font-medium">
              Section (leave empty to keep at project level / self)
            </label>
            <select
              className="border rounded p-2"
              value={form.sectionId || ""}
              onChange={(e) =>
                setForm({ ...form, sectionId: e.target.value })
              }
            >
              <option value="">Self / Project level</option>
              {sectionsForProject.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {form.sectionId && (
              <>
                <label className="text-sm font-medium">
                  Recipient Accountant
                </label>
                <select
                  className="border rounded p-2"
                  value={form.recipientUserId || ""}
                  onChange={(e) =>
                    setForm({ ...form, recipientUserId: e.target.value })
                  }
                >
                  <option value="">Select accountant</option>
                  {projectAccountants
                    .filter((a) => a.sectionId === form.sectionId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.email})
                      </option>
                    ))}
                </select>
              </>
            )}
            <CustomTextField
              label="Amount *"
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <CustomTextField
              label="Note"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-800"
              />
              <Button
                buttonText={submitting ? "Saving..." : "Distribute"}
                onClick={handleSubmitDistribution}
                className="flex-1"
                disabled={submitting}
              />
            </div>
          </div>
        </Box>
      </Modal>

      {/* Section Expense Modal */}
      <Modal open={modal === "sectionExpense"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Section Expense</h2>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Project *</label>
            <select
              className="border rounded p-2"
              value={form.projectId || ""}
              onChange={(e) =>
                setForm({ ...form, projectId: e.target.value, sectionId: "" })
              }
            >
              <option value="">Select project</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <label className="text-sm font-medium">Section *</label>
            <select
              className="border rounded p-2"
              value={form.sectionId || ""}
              onChange={(e) =>
                setForm({ ...form, sectionId: e.target.value })
              }
            >
              <option value="">Select section</option>
              {sectionsForProject.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <label className="text-sm font-medium">Expense Head *</label>
            <select
              className="border rounded p-2"
              value={form.expenseHeadId || ""}
              onChange={(e) =>
                setForm({ ...form, expenseHeadId: e.target.value })
              }
            >
              <option value="">Select head</option>
              {expenseHeads.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
            <CustomTextField
              label="Amount *"
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <CustomTextField
              label="Note"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div>
              <label className="text-sm font-medium">Proof (optional)</label>
              <input
                type="file"
                className="border rounded p-2 w-full mt-1"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-800"
              />
              <Button
                buttonText={submitting ? "Saving..." : "Record"}
                onClick={handleSubmitSectionExpense}
                className="flex-1"
                disabled={submitting}
              />
            </div>
          </div>
        </Box>
      </Modal>

      {/* Expense Heads Modal */}
      <Modal open={modal === "heads"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Expense Heads</h2>
          {!isReadOnly && (
            <div className="flex flex-col gap-3 mb-4 border-b pb-4">
              <CustomTextField
                label="Name *"
                value={headForm.name}
                onChange={(e) =>
                  setHeadForm({ ...headForm, name: e.target.value })
                }
              />
              <CustomTextField
                label="Description"
                value={headForm.description}
                onChange={(e) =>
                  setHeadForm({ ...headForm, description: e.target.value })
                }
              />
              <Button
                buttonText="Add Head"
                onClick={handleAddHead}
                disabled={submitting}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {expenseHeads.map((h) => (
              <div
                key={h.id}
                className="flex justify-between items-center border rounded p-2"
              >
                <div>
                  <p className="font-medium">{h.name}</p>
                  {h.description && (
                    <p className="text-xs text-gray-500">{h.description}</p>
                  )}
                </div>
                {!isReadOnly && (
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => handleDeleteHead(h.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            {expenseHeads.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No expense heads yet. Add Utility Bills, Lunch, Groceries, etc.
              </p>
            )}
          </div>
          <Button
            buttonText="Close"
            onClick={closeModal}
            className="mt-4 w-full bg-gray-200 text-gray-800"
          />
        </Box>
      </Modal>
    </div>
  );
};

export default PettyCashModule;
