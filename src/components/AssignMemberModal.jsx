import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AddMemberModal from "../layouts/admin-dashboard/screens/users/modals/AddMemberModal";
import { Button, Input, CircularProgress, Checkbox, FormControlLabel } from "@mui/material";
import { Search } from "@mui/icons-material";
import Loader from "./ui/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
  borderRadius: "16px",
  background: "white",
  p: 4,
};

const AssignMemberModal = ({
  role,
  open,
  onClose,
  fetchUsers,
  createUser,
  fetchSections, // optional
  fetchStores,   // optional - for store selection step (e.g., CM)
  onAssign,
  askCreateStore = false, // optional - show Yes/No prompt to create a section store
}) => {
  const [step, setStep] = useState(1);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [storesLoading, setStoresLoading] = useState(false);
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [note, setNote] = useState("");
  const [createStore, setCreateStore] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedUser(null);
      setShowAddUser(false);
      setSelectedSections([]);
      setSelectedStores([]);
      setCreateStore(false);
      fetchUsersList();
    }
    // eslint-disable-next-line
  }, [open]);

  const fetchUsersList = async () => {
    setLoading(true);
    const result = await fetchUsers(role, search);
    setUsers(result || []);
    setLoading(false);
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    if (fetchStores) {
      setStep(3);
      setStoresLoading(true);
      try {
        const fetchedStores = await fetchStores();
        setStores(fetchedStores || []);
        setSelectedStores([]);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setStoresLoading(false);
      }
    } else if (fetchSections) {
      setStep(3);
      setSectionsLoading(true);
      try {
        // Fetch sections for the selected user
        const fetchedSections = await fetchSections(user.id);
        setSections(fetchedSections);
        // Pre-select sections assigned to current user
        setSelectedSections(
          fetchedSections.filter((s) => s.assignedToCurrentUser).map((s) => s.id)
        );
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setSectionsLoading(false);
      }
    } else if (askCreateStore) {
      setStep(4);
    } else {
      onAssign({ userId: user.id });
      onClose();
    }
  };

  const handleCreateUser = async (userData) => {
    setCreateUserLoading(true);
    try {
      const newUser = await createUser(userData, role);
      if (newUser && newUser.id) {
        setSelectedUser(newUser);
        if (fetchStores) {
          setStep(3);
          setStoresLoading(true);
          try {
            const fetchedStores = await fetchStores();
            setStores(fetchedStores || []);
            setSelectedStores([]);
          } catch (error) {
            console.error("Error fetching stores:", error);
          } finally {
            setStoresLoading(false);
          }
        } else if (fetchSections) {
          setStep(3);
          setSectionsLoading(true);
          try {
            // Fetch sections for the newly created user
            const fetchedSections = await fetchSections(newUser.id);
            setSections(fetchedSections);
            setSelectedSections(
              fetchedSections
                .filter((s) => s.assignedToCurrentUser)
                .map((s) => s.id)
            );
          } catch (error) {
            console.error("Error fetching sections:", error);
          } finally {
            setSectionsLoading(false);
          }
        } else if (askCreateStore) {
          setStep(4);
        } else {
          onAssign({ userId: newUser.id });
          onClose();
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setCreateUserLoading(false);
    }
  };

  const fetchSectionsList = async () => {
    setSectionsLoading(true);
    try {
      const result = await fetchSections();
      setSections(result || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setSectionsLoading(false);
    }
  };

  // Step 1: User selection (AssignProjectManagerModal UI)
  const renderUserSelection = () => {
    // Filter users by search string in real time
    const filteredUsers = users.filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="rounded-xl bg-[#f3f3f5] p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => setStep(2)}
            className="flex items-center w-full gap-3 rounded-xl px-4 py-4 bg-white"
          >
            <div className="bg-[#fc8908] text-white px-2  rounded-sm text-center">
              +
            </div>
            Create a new Member
          </button>
          <div className="relative">
            <Input
              placeholder={`Search ${role}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white w-full rounded-xl px-4 py-3 h-auto text-base placeholder:text-[#8897ad] pr-12 "
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8897ad]" />
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 min-h-[48px] flex flex-col items-center justify-center">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader text="Loading users..." />
              </div>
            ) : filteredUsers.length === 0 ? (
              <span className="text-gray-400 text-sm">No users found.</span>
            ) : (
              filteredUsers.map((member, index) => (
                <div
                  key={member.id}
                  onClick={() => handleUserSelect(member)}
                  className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm transition-all border-2 border-transparent cursor-pointer hover:border-2 hover:border-[#fc8908] w-full"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f7f7f8] flex-shrink-0">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt="Member avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[#043b6a] font-medium text-base">
                    {member.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Step 2: User creation (AddMemberModal UI, but as a step)
  const renderUserCreation = () => (
    <div className="flex flex-col items-center justify-center">
      {createUserLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader text="Creating user..." />
        </div>
      ) : (
        <AddMemberModal
          onClose={() => setStep(1)}
          onAddUserClick={handleCreateUser}
        />
      )}
    </div>
  );

  // Step 3: Section assignment (AssignSectionModal UI, but as a step)
  const renderSectionAssignment = () => (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-[#043b6a] mb-4">
        Assign Sections
      </h2>
      {sectionsLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader text="Loading sections..." />
        </div>
      ) : assignLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader text="Assigning sections..." />
        </div>
      ) : (
        <>
          <AssignSectionStep
            sections={sections}
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
            onCancel={onClose}
            onSubmit={handleAssignSections}
            loading={assignLoading}
            role={role}
          />
       
        </>
      )}
    </div>
  );

  // Only close modal after successful assignment
  const handleAssignSections = async () => {
    setAssignLoading(true);
    const result = await onAssign({
      userId: selectedUser.id,
      sectionIds: selectedSections,
      note: note,
    });
    setAssignLoading(false);
    if (result === true) {
      onClose();
    }
    // If result is not true, assume error is shown in toast and keep modal open
  };

  const renderStoreAssignment = () => (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-[#043b6a] mb-4">
        Assign Stores
      </h2>
      {storesLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader text="Loading stores..." />
        </div>
      ) : assignLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader text="Assigning..." />
        </div>
      ) : (
        <>
          <AssignStoreStep
            stores={stores}
            selectedStores={selectedStores}
            setSelectedStores={setSelectedStores}
            onCancel={onClose}
            onSubmit={handleAssignStores}
            loading={assignLoading}
          />
          {askCreateStore && (
            <div className="w-full mt-3 px-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={createStore}
                    onChange={(e) => setCreateStore(e.target.checked)}
                    color="primary"
                  />
                }
                label="Also create a Section Store for this section"
              />
            </div>
          )}
        </>
      )}
    </div>
  );

  const handleAssignStores = async () => {
    setAssignLoading(true);
    const result = await onAssign({
      userId: selectedUser.id,
      storeIds: selectedStores,
      createStore,
    });
    setAssignLoading(false);
    if (result === true) {
      onClose();
    }
  };

  // Step 4: Ask whether to create a section store (when no fetchStores is provided)
  const handleCreateStoreDecision = async (value) => {
    setAssignLoading(true);
    const result = await onAssign({ userId: selectedUser.id, createStore: value });
    setAssignLoading(false);
    if (result !== false) {
      onClose();
    }
  };

  const renderCreateStorePrompt = () => (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      <h2 className="text-2xl font-semibold text-[#043b6a] text-center">
        Create Section Store?
      </h2>
      <p className="text-gray-500 text-center text-sm max-w-sm">
        Would you like to create a Section Store for this section? You can also create one later from the section settings.
      </p>
      {assignLoading ? (
        <Loader text="Assigning..." />
      ) : (
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={() => handleCreateStoreDecision(false)}
            className="flex-1 max-w-[160px] rounded-xl border border-gray-300 px-4 py-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            No, skip
          </button>
          <button
            onClick={() => handleCreateStoreDecision(true)}
            className="flex-1 max-w-[160px] rounded-xl bg-[#fc8908] text-white px-4 py-3 font-medium hover:bg-[#e07b07] transition-colors"
          >
            Yes, create store
          </button>
        </div>
      )}
    </div>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {step === 1 && renderUserSelection()}
        {step === 2 && renderUserCreation()}
        {step === 3 && fetchSections && !fetchStores && renderSectionAssignment()}
        {step === 3 && fetchStores && renderStoreAssignment()}
        {step === 4 && renderCreateStorePrompt()}
      </Box>
    </Modal>
  );
};

// Section assignment step UI (extracted from AssignSectionModal)
function AssignSectionStep({
  sections,
  selectedSections,
  setSelectedSections,
  onCancel,
  onSubmit,
  loading,
  role,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCheckboxChange = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (role === "Accountant" || role === "Site Incharge") {
      // For Accountants and Site Incharge: include all sections regardless of assignment status
      if (
        filteredSections.every(
          (s) => selectedSections.includes(s.id)
        )
      ) {
        // Unselect all
        setSelectedSections((prev) =>
          prev.filter(
            (id) => !filteredSections.some((s) => s.id === id)
          )
        );
      } else {
        setSelectedSections((prev) => [
          ...prev,
          ...filteredSections
            .filter((s) => !prev.includes(s.id))
            .map((s) => s.id),
        ]);
      }
    } else {
      // For other roles: exclude sections assigned to others
      if (
        filteredSections.every(
          (s) => selectedSections.includes(s.id) || s.assignedToOther
        )
      ) {
        // Only unselect those that are not assignedToOther
        setSelectedSections((prev) =>
          prev.filter(
            (id) =>
              !filteredSections.some((s) => s.id === id && !s.assignedToOther)
          )
        );
      } else {
        setSelectedSections((prev) => [
          ...prev,
          ...filteredSections
            .filter((s) => !prev.includes(s.id) && !s.assignedToOther)
            .map((s) => s.id),
        ]);
      }
    }
  };
  const isAllSelected =
    filteredSections.length > 0 &&
    (role === "Accountant" || role === "Site Incharge"
      ? filteredSections.every((s) => selectedSections.includes(s.id))
      : filteredSections.every(
          (s) => selectedSections.includes(s.id) || s.assignedToOther
        ));
  return (
    <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div className="relative">
        <Input
          placeholder="Search sections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full !rounded-xl !bg-[#f9f9fb] !px-4 !py-3 !h-auto !text-sm placeholder:text-gray-500 pr-12"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
      {filteredSections.length > 0 && (
        <div
          onClick={handleSelectAll}
          className="flex justify-between items-center cursor-pointer rounded-xl border border-gray-200 hover:border-[#fc8908] bg-[#f8f9fc] px-4 py-3 transition"
        >
          <span className="text-sm font-medium text-[#043b6a]">
            {isAllSelected ? "Unselect All" : "Select All"}
          </span>
          <input type="checkbox" checked={isAllSelected} readOnly />
        </div>
      )}
      <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
        {filteredSections.map((section) => (
          <div
            key={section.id}
            className="flex justify-between items-center rounded-xl border border-gray-100 bg-white px-4 py-3 hover:shadow-sm transition cursor-pointer hover:border-[#fc8908]"
          >
            <div className="flex flex-col flex-1">
              <span
                className={`text-sm font-medium ${
                  section.assignedToOther ? "text-gray-400" : "text-[#043b6a]"
                }`}
              >
                {section.name}
              </span>
              {section.assignedToOther && (role === "Accountant" || role === "Site Incharge") && (
                <span className="text-xs text-orange-500 mt-1">
                  Section assigned to other {role === "Accountant" ? "accountant" : "site incharge"}
                </span>
              )}
            </div>
                         <input
               type="checkbox"
               checked={
                 role === "Accountant" || role === "Site Incharge"
                   ? selectedSections.includes(section.id)
                   : selectedSections.includes(section.id) || section.assignedToOther
               }
               onChange={() => handleCheckboxChange(section.id)}
               disabled={section.assignedToOther && role !== "Accountant" && role !== "Site Incharge"}
             />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="bg-primary px-8 py-2 rounded-lg font-medium text-white"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

function AssignStoreStep({ stores, selectedStores, setSelectedStores, onCancel, onSubmit, loading }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (id) => {
    setSelectedStores((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div className="relative">
        <Input
          placeholder="Search stores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full !rounded-xl !bg-[#f9f9fb] !px-4 !py-3 !h-auto !text-sm placeholder:text-gray-500 pr-12"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {filteredStores.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">
          No stores found in this section. You can still assign the CM.
        </p>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => handleCheckboxChange(store.id)}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white cursor-pointer hover:border-[#fc8908] transition"
            >
              <input
                type="checkbox"
                checked={selectedStores.includes(store.id)}
                onChange={() => handleCheckboxChange(store.id)}
                onClick={(e) => e.stopPropagation()}
                className="accent-[#fc8908]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#043b6a]">{store.name}</span>
                <span className="text-xs text-gray-400">
                  {store.type?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="bg-primary px-8 py-2 rounded-lg font-medium text-white"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </div>
    </div>
  );
}

export default AssignMemberModal;
