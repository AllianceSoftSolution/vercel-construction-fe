import React, { useEffect, useState, useCallback } from "react";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../../components/ui/Loader";
import SimpleTable from "../../../../components/SimpleTable";
import { Chip } from "@mui/material";
import { FaUserEdit, FaUserMinus, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IconButton } from "@mui/material";
import DeleteModal from "../../../../mui/DeleteModal";

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

// ─── Assign Personnel Modal ─────────────────────────────────────
const AssignPersonnelModal = ({ store, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(store?.assignedUserId || "");
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    apiClient
      .get("/auth/users?role=STORE_INCHARGE")
      .then((r) => {
        if (r.ok) setUsers(r.data.users || []);
      });
  }, []);

  const handleAssign = async () => {
    if (!selectedUserId) { toast.error("Please select a user"); return; }
    try {
      setLoading(true);
      const res = await apiClient.patch(`/stores/${store.id}/assign`, { userId: selectedUserId });
      if (res.ok) {
        toast.success("Personnel assigned successfully");
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

  const handleRemove = async () => {
    try {
      setRemoving(true);
      const res = await apiClient.delete(`/stores/${store.id}/assign`);
      if (res.ok) {
        toast.success("Assignment removed");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to remove assignment");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRemoving(false);
    }
  };

  const currentPerson = store?.assignedUser || store?.storeInchargeAssignments?.[0]?.user;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Assign Personnel</h2>
        <p className="text-sm text-gray-500 mb-4">Store: <strong>{store?.name}</strong></p>

        {currentPerson && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">{currentPerson.name}</p>
              <p className="text-xs text-gray-500">{currentPerson.email} · {currentPerson.role?.replace(/_/g, " ")}</p>
            </div>
            <button
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
            >
              <FaUserMinus size={12} />
              {removing ? "Removing..." : "Remove"}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Select Personnel</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role?.replace(/_/g, " ")})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-1">
            <button
              onClick={handleAssign}
              disabled={loading}
              className="flex-1 bg-[#F97316] text-white rounded-lg py-2 font-semibold text-sm hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Assign"}
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

// ─── Store Creation Tab (main export) ───────────────────────────
const StoreCreationTab = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showHeadModal, setShowHeadModal] = useState(false);
  const [assignStore, setAssignStore] = useState(null);

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

  const AssignedPersonCell = ({ value: store }) => {
    const person = store?.assignedUser || store?.storeInchargeAssignments?.[0]?.user;
    return person ? (
      <span className="text-sm text-gray-700 font-medium">{person.name}</span>
    ) : (
      <span className="text-sm text-gray-400 italic">Unassigned</span>
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
    </div>
  );
};

export default StoreCreationTab;
