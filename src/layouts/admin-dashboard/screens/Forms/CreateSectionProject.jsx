import React, { useState, useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Box,
} from "@mui/material";

const PERMISSION_LABELS = [
  { key: "canViewStock", label: "View Stock" },
  { key: "canRequestMaterials", label: "Request Materials" },
  { key: "canApproveMaterials", label: "Approve Materials" },
  { key: "canAddStock", label: "Add / Receive Stock" },
  { key: "canTransferStock", label: "Transfer Stock" },
];

const DEFAULT_PERMS = {
  canViewStock: true,
  canRequestMaterials: false,
  canApproveMaterials: false,
  canAddStock: false,
  canTransferStock: false,
};

const CreateSectionProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const pId = params.get("id");

  // Step 1: section info | Step 2: store access
  const [step, setStep] = useState(1);

  // Step 2 state
  const [createStore, setCreateStore] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [storePermissions, setStorePermissions] = useState([]); // [{ userId, name, ...perms }]

  const validationSchema = Yup.object({
    name: Yup.string().required("Section name is required"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema,
    onSubmit: () => setStep(2), // move to step 2 on valid submit
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/auth/users");
        if (res.ok) setUsers(res.data?.users || []);
      } catch {}
    };
    fetchUsers();
  }, []);

  const addUserToPermissions = () => {
    if (!selectedUserId) return;
    if (storePermissions.find((p) => p.userId === selectedUserId)) {
      toast.error("User already added");
      return;
    }
    const user = users.find((u) => u.id === selectedUserId);
    setStorePermissions((prev) => [
      ...prev,
      { userId: selectedUserId, name: user?.name || selectedUserId, ...DEFAULT_PERMS },
    ]);
    setSelectedUserId("");
  };

  const removeUserPermission = (userId) => {
    setStorePermissions((prev) => prev.filter((p) => p.userId !== userId));
  };

  const togglePerm = (userId, key) => {
    setStorePermissions((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, [key]: !p[key] } : p))
    );
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post("/sections", {
        name: formik.values.name,
        description: formik.values.description,
        projectId: pId,
        createStore,
        storePermissions: createStore
          ? storePermissions.map(({ userId, canViewStock, canRequestMaterials, canApproveMaterials, canAddStock, canTransferStock }) => ({
              userId, canViewStock, canRequestMaterials, canApproveMaterials, canAddStock, canTransferStock,
            }))
          : [],
      });
      if (response.ok) {
        toast.success(createStore ? "Section and store created successfully!" : "Section created successfully!");
        navigate(-1);
      } else {
        toast.error(response.data?.message || "Section creation failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        icon={
          <FaArrowLeftLong className="w-8 h-8 p-2 bg-[#EBEBEB] rounded-full" />
        }
        title="New Section"
        detail="Add New Section Information in Epos Software"
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === 1 ? "bg-primary text-white" : "bg-green-500 text-white"
          }`}>1</div>
          <span className="text-sm font-medium text-gray-700">Section Info</span>
        </div>
        <div className="w-12 h-[2px] bg-gray-300"></div>
        <div className={`flex items-center gap-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === 2 ? "bg-primary text-white" : "bg-gray-300 text-gray-500"
          }`}>2</div>
          <span className="text-sm font-medium text-gray-700">Store Access</span>
        </div>
      </div>

      {step === 1 && (
        <div className="flex justify-center">
          <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
            <h3 className="text-xl font-semibold text-[#12141D]">Create Section</h3>

            <CustomTextField
              label={<span className="flex items-center gap-1">Section Name</span>}
              fullWidth
              name="name"
              placeholder="Enter Section Name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />
            <CustomTextField
              label={<span className="flex items-center gap-1">Description</span>}
              fullWidth
              name="description"
              placeholder="Enter Description"
              type="text"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && formik.errors.description}
            />

            <div className="flex gap-4 justify-center w-full mt-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
              >
                Back
              </button>
              <button
                className="bg-primary px-10 py-2 rounded-lg font-medium text-white"
                onClick={formik.handleSubmit}
              >
                Next: Store Access
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex justify-center">
          <div className="flex flex-col w-full md:w-[70%] gap-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[#12141D] mb-1">Configure Store Access</h3>
              <p className="text-sm text-gray-500">
                Optionally create a Section Store and configure user access. If you skip this, no store will be created.
              </p>
            </div>

            {/* Create store toggle */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={createStore}
                    onChange={(e) => {
                      setCreateStore(e.target.checked);
                      if (!e.target.checked) {
                        setStorePermissions([]);
                        setSelectedUserId("");
                      }
                    }}
                  />
                }
                label={
                  <span className="font-medium text-[#12141D]">
                    Create a Section Store for this section
                  </span>
                }
              />
              {!createStore && (
                <p className="text-xs text-gray-400 mt-1 ml-8">
                  Leave unchecked to skip store creation. You can create a store later from the Stores tab.
                </p>
              )}
            </div>

            {/* User selector + permissions — only shown when createStore is checked */}
            {createStore && (
              <>
            {/* User selector */}
            <div className="flex gap-3 items-end">
              <FormControl fullWidth size="small">
                <InputLabel>Select User</InputLabel>
                <Select
                  value={selectedUserId}
                  label="Select User"
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {users
                    .filter((u) => !storePermissions.find((p) => p.userId === u.id))
                    .map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name} — <span className="text-gray-400 text-xs ml-1">{u.role}</span>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <button
                onClick={addUserToPermissions}
                disabled={!selectedUserId}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-40 whitespace-nowrap"
              >
                + Add User
              </button>
            </div>

            {/* Permission rows */}
            {storePermissions.length === 0 && (
              <p className="text-sm text-gray-400 italic">No users added yet. The store will be created without specific user permissions.</p>
            )}

            {storePermissions.map((perm) => (
              <div key={perm.userId} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[#12141D]">{perm.name}</span>
                  <button
                    onClick={() => removeUserPermission(perm.userId)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PERMISSION_LABELS.map(({ key, label }) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={perm[key]}
                          onChange={() => togglePerm(perm.userId, key)}
                          size="small"
                        />
                      }
                      label={<span className="text-sm">{label}</span>}
                    />
                  ))}
                </div>
              </div>
            ))}
              </>
            )}

            <div className="flex gap-4 justify-center w-full mt-2">
              <button
                onClick={() => setStep(1)}
                className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
              >
                Back
              </button>
              <button
                className="bg-primary px-10 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                onClick={handleFinalSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Create Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSectionProject;
