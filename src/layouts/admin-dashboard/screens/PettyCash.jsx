import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Chip, IconButton, Modal, Tab, Tabs } from "@mui/material";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AccountBalance, Payments, TrendingDown, Wallet } from "@mui/icons-material";
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

const TYPE_COLORS = {
  FUNDING: "success",
  DISTRIBUTION: "info",
  INTERNAL_EXPENSE: "warning",
  SECTION_EXPENSE: "error",
};

const formatCurrency = (n) =>
  `Rs. ${Number(n || 0).toLocaleString("en-PK", { minimumFractionDigits: 0 })}`;

const PettyCashModule = ({ dashboardBase = "/admin-dashboard" }) => {
  const user = useSelector((s) => s.auth.user);
  const isReadOnly = useReadOnly();
  const isHeadOffice =
    ["ADMIN", "SUPER_ADMIN", "SUB_ADMIN"].includes(user?.role) ||
    (user?.role === "ACCOUNTANT" && isHeadUser(user));

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectBalance, setProjectBalance] = useState(null);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [headForm, setHeadForm] = useState({ name: "", description: "" });
  const [projectAccountants, setProjectAccountants] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, projRes, txRes, headsRes, allProjRes, allSecRes] =
        await Promise.all([
          apiClient.get("/petty-cash/summary"),
          apiClient.get("/petty-cash/summary/by-project"),
          apiClient.get("/petty-cash/transactions", {
            projectId: selectedProject?.id,
            ...filters,
          }),
          apiClient.get("/petty-cash/expense-heads"),
          apiClient.get("/projects"),
          apiClient.get("/sections"),
        ]);

      if (sumRes.ok) setSummary(sumRes.data?.data);
      if (projRes.ok) setProjects(projRes.data?.data || []);
      if (txRes.ok) setTransactions(txRes.data?.data || []);
      if (headsRes.ok) setExpenseHeads(headsRes.data?.data || []);
      if (allProjRes.ok) setAllProjects(allProjRes.data?.data?.projects || allProjRes.data?.data || []);
      if (allSecRes.ok) setAllSections(allSecRes.data?.data?.sections || allSecRes.data?.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load petty cash data");
    } finally {
      setLoading(false);
    }
  }, [selectedProject?.id, filters]);

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
    setHeadForm({ name: "", description: "" });
  };

  const handleSubmitFunding = async () => {
    if (!form.projectId) return toast.error("Select a project");
    if (!form.amount || Number(form.amount) <= 0)
      return toast.error("Enter a valid amount");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("projectId", form.projectId);
      fd.append("amount", form.amount);
      if (form.description) fd.append("description", form.description);
      if (file) fd.append("proofOfExpense", file);
      const res = await apiClient.post("/petty-cash/funding", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.ok) {
        toast.success("Petty cash funded successfully");
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else toast.error(res.data?.message || "Failed");
    } catch {
      toast.error("Error adding funding");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitInternal = async () => {
    if (!form.projectId) return toast.error("Select a project");
    if (!form.expenseHeadId) return toast.error("Select expense head");
    if (!form.amount || Number(form.amount) <= 0)
      return toast.error("Enter a valid amount");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("projectId", form.projectId);
      fd.append("expenseHeadId", form.expenseHeadId);
      fd.append("amount", form.amount);
      if (form.description) fd.append("description", form.description);
      if (file) fd.append("proofOfExpense", file);
      const res = await apiClient.post("/petty-cash/internal-expense", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.ok) {
        toast.success("Internal expense recorded");
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else toast.error(res.data?.message || "Failed");
    } catch {
      toast.error("Error recording expense");
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
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "project", label: "Project" },
    { key: "section", label: "Section" },
    { key: "head", label: "Expense Head" },
    { key: "amount", label: "Amount" },
    { key: "recipient", label: "Recipient" },
    { key: "createdBy", label: "By" },
    { key: "description", label: "Note" },
  ];

  const filterGroups = [
    {
      group: "Type",
      options: Object.entries(TYPE_LABELS).map(([value, label]) => ({
        label,
        value,
      })),
    },
    {
      group: "Project",
      options: allProjects.map((p) => ({ label: p.name, value: p.id })),
    },
  ];

  if (loading && !summary) return <Loader />;

  return (
    <div className="p-4 md:p-6">
      <TopBar
        title="Petty Cash"
        subtitle="Manage project petty cash funding, distribution & expenses"
      />

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

      {/* Action buttons */}
      {!isReadOnly && (
        <div className="flex flex-wrap gap-3 mb-6">
          {summary?.canAddFunding && (
            <Button
              buttonText="+ Add Funding"
              onClick={() => openModal("funding", { projectId: selectedProject?.id })}
            />
          )}
          {summary?.canAddInternalExpense && (
            <Button
              buttonText="+ Internal Expense"
              onClick={() =>
                openModal("internal", { projectId: selectedProject?.id })
              }
              className="bg-amber-600"
            />
          )}
          {summary?.canManageHeads && (
            <Button
              buttonText="Manage Expense Heads"
              onClick={() => openModal("heads")}
              className="bg-gray-600"
            />
          )}
          {summary?.canDistribute && (
            <Button
              buttonText="+ Distribute"
              onClick={() =>
                openModal("distribution", { projectId: selectedProject?.id })
              }
              className="bg-indigo-600"
            />
          )}
          {summary?.canAddSectionExpense && (
            <Button
              buttonText="+ Section Expense"
              onClick={() =>
                openModal("sectionExpense", {
                  projectId: selectedProject?.id,
                })
              }
              className="bg-rose-600"
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
              <h2 className="text-xl font-bold mb-2">{selectedProject.name}</h2>
              {projectBalance && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Funded</p>
                    <p className="font-bold">{formatCurrency(projectBalance.totalFunded)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Distributed</p>
                    <p className="font-bold">{formatCurrency(projectBalance.totalDistributed)}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Internal Expenses</p>
                    <p className="font-bold">{formatCurrency(projectBalance.totalInternalExpenses)}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Pool Remaining</p>
                    <p className="font-bold">{formatCurrency(projectBalance.projectPoolRemaining)}</p>
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
              <SimpleTable data={tableData.filter((r) => r.project === selectedProject.name)} columns={columns} />
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
                      <p className="font-semibold">{formatCurrency(p.totalFunded)}</p>
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
                <p className="text-gray-500 col-span-full">No petty cash data yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div>
          <div className="mb-4">
            <CustomFilterDropdown
              filters={filterGroups}
              selected={filters}
              onChange={(group, value) =>
                setFilters((prev) => ({
                  ...prev,
                  [group === "Type" ? "type" : "projectId"]: value,
                }))
              }
              onClear={() => setFilters({})}
            />
          </div>
          <SimpleTable data={tableData} columns={columns} />
        </div>
      )}

      {/* Funding Modal */}
      <Modal open={modal === "funding"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Add Petty Cash (Project)</h2>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Project *</label>
            <select
              className="border rounded p-2"
              value={form.projectId || ""}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Select project</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div>
              <label className="text-sm font-medium">Proof (optional)</label>
              <input type="file" className="border rounded p-2 w-full mt-1" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className="flex gap-3">
              <Button buttonText="Cancel" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-800" />
              <Button buttonText={submitting ? "Saving..." : "Add Funding"} onClick={handleSubmitFunding} className="flex-1" disabled={submitting} />
            </div>
          </div>
        </Box>
      </Modal>

      {/* Internal Expense Modal */}
      <Modal open={modal === "internal"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Internal Expense</h2>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Project *</label>
            <select className="border rounded p-2" value={form.projectId || ""} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              <option value="">Select project</option>
              {allProjects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
            <label className="text-sm font-medium">Expense Head *</label>
            <select className="border rounded p-2" value={form.expenseHeadId || ""} onChange={(e) => setForm({ ...form, expenseHeadId: e.target.value })}>
              <option value="">Select head</option>
              {expenseHeads.map((h) => (<option key={h.id} value={h.id}>{h.name}</option>))}
            </select>
            <CustomTextField label="Amount *" type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <CustomTextField label="Note" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div>
              <label className="text-sm font-medium">Proof (optional)</label>
              <input type="file" className="border rounded p-2 w-full mt-1" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className="flex gap-3">
              <Button buttonText="Cancel" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-800" />
              <Button buttonText={submitting ? "Saving..." : "Record Expense"} onClick={handleSubmitInternal} className="flex-1" disabled={submitting} />
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
                setForm({ ...form, projectId, sectionId: "", recipientUserId: "" });
                if (projectId) {
                  const res = await apiClient.get(`/petty-cash/projects/${projectId}/accountants`);
                  if (res.ok) setProjectAccountants(res.data?.data || []);
                }
              }}
            >
              <option value="">Select project</option>
              {allProjects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
            <label className="text-sm font-medium">Section (optional — leave empty for self)</label>
            <select className="border rounded p-2" value={form.sectionId || ""} onChange={(e) => setForm({ ...form, sectionId: e.target.value })}>
              <option value="">Self / Project level</option>
              {sectionsForProject.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            {form.sectionId && (
              <>
                <label className="text-sm font-medium">Recipient Accountant</label>
                <select className="border rounded p-2" value={form.recipientUserId || ""} onChange={(e) => setForm({ ...form, recipientUserId: e.target.value })}>
                  <option value="">Select accountant</option>
                  {projectAccountants.filter((a) => a.sectionId === form.sectionId).map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                  ))}
                </select>
              </>
            )}
            <CustomTextField label="Amount *" type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <CustomTextField label="Note" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-3">
              <Button buttonText="Cancel" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-800" />
              <Button buttonText={submitting ? "Saving..." : "Distribute"} onClick={handleSubmitDistribution} className="flex-1" disabled={submitting} />
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
            <select className="border rounded p-2" value={form.projectId || ""} onChange={(e) => setForm({ ...form, projectId: e.target.value, sectionId: "" })}>
              <option value="">Select project</option>
              {allProjects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
            <label className="text-sm font-medium">Section *</label>
            <select className="border rounded p-2" value={form.sectionId || ""} onChange={(e) => setForm({ ...form, sectionId: e.target.value })}>
              <option value="">Select section</option>
              {sectionsForProject.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            <label className="text-sm font-medium">Expense Head *</label>
            <select className="border rounded p-2" value={form.expenseHeadId || ""} onChange={(e) => setForm({ ...form, expenseHeadId: e.target.value })}>
              <option value="">Select head</option>
              {expenseHeads.map((h) => (<option key={h.id} value={h.id}>{h.name}</option>))}
            </select>
            <CustomTextField label="Amount *" type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <CustomTextField label="Note" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div>
              <label className="text-sm font-medium">Proof (optional)</label>
              <input type="file" className="border rounded p-2 w-full mt-1" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className="flex gap-3">
              <Button buttonText="Cancel" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-800" />
              <Button buttonText={submitting ? "Saving..." : "Record"} onClick={handleSubmitSectionExpense} className="flex-1" disabled={submitting} />
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
              <CustomTextField label="Name *" value={headForm.name} onChange={(e) => setHeadForm({ ...headForm, name: e.target.value })} />
              <CustomTextField label="Description" value={headForm.description} onChange={(e) => setHeadForm({ ...headForm, description: e.target.value })} />
              <Button buttonText="Add Head" onClick={handleAddHead} disabled={submitting} />
            </div>
          )}
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {expenseHeads.map((h) => (
              <div key={h.id} className="flex justify-between items-center border rounded p-2">
                <div>
                  <p className="font-medium">{h.name}</p>
                  {h.description && <p className="text-xs text-gray-500">{h.description}</p>}
                </div>
                {!isReadOnly && (
                  <button className="text-red-500 text-sm" onClick={() => handleDeleteHead(h.id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
          <Button buttonText="Close" onClick={closeModal} className="mt-4 w-full bg-gray-200 text-gray-800" />
        </Box>
      </Modal>
    </div>
  );
};

export default PettyCashModule;
