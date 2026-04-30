import React, { useEffect, useState, useCallback } from "react";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../../components/ui/Loader";
import SimpleTable from "../../../../components/SimpleTable";
import { Chip } from "@mui/material";
import { FaUserEdit, FaUserMinus, FaEye, FaTrash, FaUserShield, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IconButton } from "@mui/material";

// ─── Type helpers ──────────────────────────────────────────────
const TYPE_COLORS = {
  HEAD_STORE: "#16a34a",
  CM_STORE: "#7c3aed",
  SECTION_STORE: "#2563eb",
};
const TYPE_LABELS = {
  HEAD_STORE: "Head Store",
  CM_STORE: "CM Store",
  SECTION_STORE: "Section Store",
};

const TypeChip = ({ value }) => {
  const type = (value || "").toUpperCase();
  return (
    <Chip
      label={TYPE_LABELS[type] || type.replace(/_/g, " ")}
      size="small"
      sx={{ bgcolor: TYPE_COLORS[type] || "#6b7280", color: "#fff", fontWeight: 600 }}
    />
  );
};

// ─── Create Section Store Modal ────────────────────────────────
const CreateSectionStoreModal = ({ onClose, onSuccess }) => {
  const [projects, setProjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({ name: "", projectId: "", sectionId: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get("/projects").then((r) => {
      if (r.ok) setProjects(r.data.projects || r.data.data || []);
    });
  }, []);

  useEffect(() => {
    if (!form.projectId) { setSections([]); return; }
    apiClient.get(`/sections?projectId=${form.projectId}`).then((r) => {
      if (r.ok) setSections(r.data.sections || r.data.data || []);
    });
  }, [form.projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.projectId || !form.sectionId) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post("/stores", {
        name: form.name,
        type: "SECTION_STORE",
        sectionId: form.sectionId,
      });
      if (res.ok) {
        toast.success("Section Store created successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to create store");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Create Section Store</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Store Name</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. Section-Store-1"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Project</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.projectId}
              onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value, sectionId: "" }))}
            >
              <option value="">Select Project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Section</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.sectionId}
              onChange={(e) => setForm((f) => ({ ...f, sectionId: e.target.value }))}
              disabled={!form.projectId}
            >
              <option value="">Select Section</option>
              {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Store Type</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
              value="Section Store"
              readOnly
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#F97316] text-white rounded-lg py-2 font-semibold text-sm hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Store"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Create Head Store Modal ────────────────────────────────────
const CreateHeadStoreModal = ({ onClose, onSuccess }) => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", projectId: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get("/projects").then((r) => {
      if (r.ok) setProjects(r.data.projects || r.data.data || []);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.projectId) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post("/stores", {
        name: form.name,
        type: "HEAD_STORE",
        projectId: form.projectId,
      });
      if (res.ok) {
        toast.success("Head Store created successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to create store");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Create Head Store</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Store Name</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. Main Head Store"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Project</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.projectId}
              onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
            >
              <option value="">Select Project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Store Type</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
              value="Head Store"
              readOnly
            />
          </div>
          <p className="text-xs text-gray-400">Only one Head Store is allowed per project.</p>
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#F97316] text-white rounded-lg py-2 font-semibold text-sm hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Store"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Assign Personnel Modal (multi-person) ─────────────────────
const AssignPersonnelModal = ({ store, onClose, onSuccess }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [roleFilter, setRoleFilter] = useState("STORE_INCHARGE");
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  // Build current assignment list from store prop
  useEffect(() => {
    const list = store?.storeInchargeAssignments?.filter((a) => a.isActive !== false) || [];
    const legacyUser = store?.assignedUser;
    if (list.length > 0) {
      setAssignments(list.map((a) => a.user).filter(Boolean));
    } else if (legacyUser) {
      setAssignments([legacyUser]);
    } else {
      setAssignments([]);
    }
  }, [store]);

  // Fetch users when role filter changes
  useEffect(() => {
    if (!roleFilter) return;
    apiClient.get(`/auth/users?role=${roleFilter}`).then((r) => {
      if (r.ok) setAllUsers(r.data.users || []);
    });
  }, [roleFilter]);

  const assignedIds = new Set(assignments.map((p) => p?.id));
  const availableUsers = allUsers.filter((u) => !assignedIds.has(u.id));

  const handleAssign = async () => {
    if (!selectedUserId) { toast.error("Please select a user"); return; }
    try {
      setLoading(true);
      const res = await apiClient.patch(`/stores/${store.id}/assign`, { userId: selectedUserId });
      if (res.ok) {
        toast.success("Person assigned successfully");
        // Add to local list optimistically
        const addedUser = allUsers.find((u) => u.id === selectedUserId);
        if (addedUser) setAssignments((prev) => [...prev, addedUser]);
        setSelectedUserId("");
        onSuccess();
      } else {
        toast.error(res.data?.message || "Assignment failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      setRemovingId(userId);
      const res = await apiClient.delete(`/stores/${store.id}/assign/${userId}`);
      if (res.ok) {
        toast.success("Assignment removed");
        setAssignments((prev) => prev.filter((p) => p?.id !== userId));
        onSuccess();
      } else {
        toast.error(res.data?.message || "Failed to remove assignment");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRemovingId(null);
    }
  };

  const ROLE_OPTIONS = [
    { value: "STORE_INCHARGE", label: "Store Incharge" },
    { value: "SITE_INCHARGE", label: "Site Incharge" },
    { value: "PROJECT_MANAGER", label: "Project Manager" },
    { value: "CONSTRUCTION_MANAGER", label: "Construction Manager" },
    { value: "ADMIN", label: "Admin" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Manage Assigned Personnel</h2>
        <p className="text-sm text-gray-500 mb-4">Store: <strong>{store?.name}</strong></p>

        {/* Current assignments */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Currently Assigned ({assignments.length})
          </p>
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-400 italic px-1">No one assigned yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {assignments.map((person) => (
                <div
                  key={person?.id}
                  className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{person?.name}</p>
                    <p className="text-xs text-gray-500">
                      {person?.email} · {person?.role?.replace(/_/g, " ")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(person?.id)}
                    disabled={removingId === person?.id}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium ml-3 flex-shrink-0"
                  >
                    <FaUserMinus size={12} />
                    {removingId === person?.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add new person */}
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Add Another Person</p>
          <div>
            <label className="text-sm font-medium text-gray-600">Filter by Role</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setSelectedUserId(""); }}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Select Person</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select User</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-1">
            <button
              onClick={handleAssign}
              disabled={loading || !selectedUserId}
              className="flex-1 bg-[#F97316] text-white rounded-lg py-2 font-semibold text-sm hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold text-sm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Assign Site Incharge Modal ─────────────────────────────────
const AssignSiteInchargeModal = ({ store, onClose, onSuccess }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [siteIncharges, setSiteIncharges] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSI, setLoadingSI] = useState(false);

  // Pre-select project from store if available
  useEffect(() => {
    apiClient.get("/projects").then((r) => {
      if (r.ok) {
        const list = r.data.projects || r.data.data || [];
        setProjects(list);
        const storeProject = store?.project || store?.section?.project;
        if (storeProject?.id) {
          setSelectedProjectId(storeProject.id);
        }
      }
    });
  }, [store]);

  // Fetch site incharges when project changes
  useEffect(() => {
    if (!selectedProjectId) { setSiteIncharges([]); return; }
    const fetchSI = async () => {
      try {
        setLoadingSI(true);
        const res = await apiClient.get(`/auth/users?role=SITE_INCHARGE`);
        if (res.ok) {
          setSiteIncharges(res.data.users || []);
        }
      } catch {
        toast.error("Failed to load site incharges");
      } finally {
        setLoadingSI(false);
      }
    };
    fetchSI();
  }, [selectedProjectId]);

  const handleAssign = async () => {
    if (!selectedUserId) { toast.error("Please select a Site Incharge"); return; }
    try {
      setLoading(true);
      const res = await apiClient.post(`/stores/${store.id}/assign-site-incharge`, {
        userId: selectedUserId,
      });
      if (res.ok) {
        toast.success("Site Incharge assigned successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "Assignment failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Assign Store to Site Incharge</h2>
        <p className="text-sm text-gray-500 mb-4">Store: <strong>{store?.name}</strong></p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Select Project</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedProjectId}
              onChange={(e) => { setSelectedProjectId(e.target.value); setSelectedUserId(""); }}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Select Site Incharge</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={!selectedProjectId || loadingSI}
            >
              <option value="">{loadingSI ? "Loading..." : "Select Site Incharge"}</option>
              {siteIncharges.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-1">
            <button
              onClick={handleAssign}
              disabled={loading || !selectedUserId}
              className="flex-1 bg-[#F97316] text-white rounded-lg py-2 font-semibold text-sm hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Assign PM Modal ────────────────────────────────────────────
const AssignPMModal = ({ store, onClose, onSuccess }) => {
  const [projects, setProjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [pms, setPms] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPMs, setLoadingPMs] = useState(false);

  // Pre-select project from store
  useEffect(() => {
    apiClient.get("/projects").then((r) => {
      if (r.ok) {
        const list = r.data.projects || r.data.data || [];
        setProjects(list);
        const storeProject = store?.project || store?.section?.project;
        if (storeProject?.id) setSelectedProjectId(storeProject.id);
      }
    });
  }, [store]);

  // Fetch sections when project changes
  useEffect(() => {
    if (!selectedProjectId) { setSections([]); return; }
    apiClient.get(`/sections?projectId=${selectedProjectId}`).then((r) => {
      if (r.ok) {
        const list = r.data.sections || r.data.data || [];
        setSections(list);
        // Auto-select store's section
        if (store?.section?.id) setSelectedSectionId(store.section.id);
      }
    });
  }, [selectedProjectId, store]);

  // Fetch PMs
  useEffect(() => {
    if (!selectedProjectId) { setPms([]); return; }
    const fetchPMs = async () => {
      try {
        setLoadingPMs(true);
        const res = await apiClient.get(`/auth/users?role=PROJECT_MANAGER`);
        if (res.ok) setPms(res.data.users || []);
      } catch {
        toast.error("Failed to load project managers");
      } finally {
        setLoadingPMs(false);
      }
    };
    fetchPMs();
  }, [selectedProjectId]);

  const handleAssign = async () => {
    if (!selectedUserId) { toast.error("Please select a Project Manager"); return; }
    try {
      setLoading(true);
      const res = await apiClient.post(`/stores/${store.id}/assign-project-manager`, {
        userId: selectedUserId,
      });
      if (res.ok) {
        toast.success("Project Manager assigned successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "Assignment failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Assign Store to Project Manager</h2>
        <p className="text-sm text-gray-500 mb-4">Store: <strong>{store?.name}</strong></p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Select Project</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedProjectId}
              onChange={(e) => { setSelectedProjectId(e.target.value); setSelectedSectionId(""); setSelectedUserId(""); }}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Select Section</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedSectionId}
              onChange={(e) => { setSelectedSectionId(e.target.value); setSelectedUserId(""); }}
              disabled={!selectedProjectId}
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Select Project Manager</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={!selectedProjectId || loadingPMs}
            >
              <option value="">{loadingPMs ? "Loading..." : "Select Project Manager"}</option>
              {pms.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-1">
            <button
              onClick={handleAssign}
              disabled={loading || !selectedUserId}
              className="flex-1 bg-[#F97316] text-white rounded-lg py-2 font-semibold text-sm hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Store Creation Tab (main export) ───────────────────────────
const StoreCreationTab = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showHeadModal, setShowHeadModal] = useState(false);
  const [assignStore, setAssignStore] = useState(null);
  const [deleteStore, setDeleteStore] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [assignSIStore, setAssignSIStore] = useState(null);
  const [assignPMStore, setAssignPMStore] = useState(null);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/stores");
      if (res.ok) {
        setStores(
          (res.data.stores || []).map((s, i) => ({
            ...s,
            rowNo: i + 1,
          }))
        );
      } else {
        toast.error("Failed to load stores");
      }
    } catch {
      toast.error("Error loading stores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleDeleteStore = async () => {
    if (!deleteStore) return;
    try {
      setDeleting(true);
      const res = await apiClient.delete(`/stores/${deleteStore.id}`);
      if (res.ok) {
        toast.success("Store removed successfully");
        setStores((prev) => prev.filter((s) => s.id !== deleteStore.id));
        setDeleteStore(null);
      } else {
        const msg = res.data?.message || "";
        if (msg.toLowerCase().includes("inventory")) {
          toast.error("Cannot remove store with existing inventory items.");
        } else {
          toast.error(msg || "Failed to remove store");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const AssignedPersonCell = ({ value: store }) => {
    const assignments = store?.storeInchargeAssignments?.filter((a) => a.isActive !== false) || [];
    const legacyUser = store?.assignedUser;
    // Merge: prefer assignments list; fall back to legacyUser if list is empty
    const people = assignments.length > 0
      ? assignments.map((a) => a.user)
      : legacyUser ? [legacyUser] : [];

    if (people.length === 0) {
      return <span className="text-sm text-gray-400 italic">Unassigned</span>;
    }
    return (
      <div className="flex flex-col gap-0.5">
        {people.map((p, i) => (
          <span key={p?.id || i} className="text-sm text-gray-700 font-medium leading-tight">
            {p?.name}
            {p?.role && (
              <span className="ml-1 text-xs text-gray-400 font-normal">
                ({p.role.replace(/_/g, " ")})
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  const ActionsCell = ({ value: store }) => (
    <DropdownButton
      items={[
        {
          label: "View",
          onClick: () => navigate(`/admin-dashboard/store/${store.id}`),
          icon: <FaEye />,
        },
        {
          label: "Assign Personnel",
          onClick: () => setAssignStore(store),
          icon: <FaUserEdit />,
        },
        {
          label: "Assign to Site Incharge",
          onClick: () => setAssignSIStore(store),
          icon: <FaUserShield />,
        },
        {
          label: "Assign to PM",
          onClick: () => setAssignPMStore(store),
          icon: <FaUserTie />,
        },
        {
          label: <span style={{ color: '#EF4444' }}>Remove</span>,
          onClick: () => setDeleteStore(store),
          icon: <FaTrash style={{ color: '#EF4444' }} />,
        },
      ]}
    >
      <IconButton size="small">
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  const ProjectCell = ({ value: store }) => {
    const project = store?.project || store?.section?.project;
    return <span className="text-sm">{project?.name || "—"}</span>;
  };

  const SectionCell = ({ value: store }) => (
    <span className="text-sm">{store?.section?.name || "—"}</span>
  );

  const StatusCell = ({ value }) => (
    <Chip
      label={value ? "Active" : "Inactive"}
      size="small"
      sx={{
        bgcolor: value ? "#dcfce7" : "#fee2e2",
        color: value ? "#16a34a" : "#dc2626",
        fontWeight: 600,
      }}
    />
  );

  const columns = [
    { headerName: "#", field: "rowNo" },
    { headerName: "Store Name", field: "name" },
    { headerName: "Project", field: "id" },       // uses ProjectCell keyed on id
    { headerName: "Type", field: "type" },
    { headerName: "Section", field: "sectionId" }, // placeholder key, uses SectionCell
    { headerName: "Status", field: "isActive" },
    { headerName: "Assigned Person", field: "assignedUserId" },
    { headerName: "Action", field: "storeRef" },  // full store ref
  ];

  // Build display data so each field maps correctly
  const tableData = stores.map((s) => ({
    rowNo: s.rowNo,
    name: s.name,
    id: s,           // ProjectCell receives full store object
    type: s.type,
    sectionId: s,    // SectionCell receives full store object
    isActive: s.isActive,
    assignedUserId: s,  // AssignedPersonCell receives full store
    storeRef: s,        // ActionsCell receives full store
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Header row with create buttons */}
      <div className="flex flex-wrap gap-3 justify-end">
        <button
          onClick={() => setShowSectionModal(true)}
          className="flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          + Create Section Store
        </button>
        <button
          onClick={() => setShowHeadModal(true)}
          className="flex items-center gap-2 bg-[#16a34a] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
        >
          + Create Head Store
        </button>
      </div>

      {/* Stores table */}
      {loading ? (
        <Loader />
      ) : (
        <SimpleTable
          columns={columns}
          data={tableData}
          cellComponents={{
            id: ProjectCell,
            sectionId: SectionCell,
            type: TypeChip,
            isActive: StatusCell,
            assignedUserId: AssignedPersonCell,
            storeRef: ActionsCell,
          }}
        />
      )}

      {/* Modals */}
      {showSectionModal && (
        <CreateSectionStoreModal
          onClose={() => setShowSectionModal(false)}
          onSuccess={fetchStores}
        />
      )}
      {showHeadModal && (
        <CreateHeadStoreModal
          onClose={() => setShowHeadModal(false)}
          onSuccess={fetchStores}
        />
      )}
      {assignStore && (
        <AssignPersonnelModal
          store={assignStore}
          onClose={() => setAssignStore(null)}
          onSuccess={fetchStores}
        />
      )}
      {assignSIStore && (
        <AssignSiteInchargeModal
          store={assignSIStore}
          onClose={() => setAssignSIStore(null)}
          onSuccess={fetchStores}
        />
      )}
      {assignPMStore && (
        <AssignPMModal
          store={assignPMStore}
          onClose={() => setAssignPMStore(null)}
          onSuccess={fetchStores}
        />
      )}
      {deleteStore && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm">
            <div className="flex items-center justify-center">
              <FaTrash className="text-white w-14 h-14 rounded-full p-4" style={{ backgroundColor: '#EF4444' }} />
            </div>
            <p className="text-black font-semibold m-4 text-center">
              Are you sure you want to remove {deleteStore.name}? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteStore}
                disabled={deleting}
                className="w-full px-4 py-2 text-white rounded-lg disabled:opacity-60"
                style={{ backgroundColor: '#EF4444' }}
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
              <button
                onClick={() => setDeleteStore(null)}
                disabled={deleting}
                className="w-full px-4 py-2 bg-white text-black rounded-lg border border-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreCreationTab;
