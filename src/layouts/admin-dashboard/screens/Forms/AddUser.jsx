import React, { useState, useEffect, useCallback } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomSelect from "../../../../mui/CustomSelect";
import { MenuItem, Checkbox, FormControlLabel, ListItemText, OutlinedInput, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import CustomModal from "../../../../comments/components/CustomModal";
import { useSelector } from "react-redux";
import { isAdminUser } from "../../../../utils/privilegedAdmin";

const AddUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authUser = useSelector((state) => state.auth?.user);
  const canSetPassword = isAdminUser(authUser);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHead, setIsHead] = useState(false);
  const [isHeadOfficeAccountant, setIsHeadOfficeAccountant] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFullEdit, setIsFullEdit] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Fetch projects list for head accountant assignment
  useEffect(() => {
    apiClient.get("/projects").then((res) => {
      if (res.ok && res.data) {
        setProjects(res.data.projects || res.data.data || res.data || []);
      }
    }).catch(() => {});
  }, []);

  // Check if we're in edit mode
  useEffect(() => {
    const userDataParam = searchParams.get('userData');
    if (userDataParam) {
      try {
        const decodedUserData = JSON.parse(decodeURIComponent(userDataParam));
        setUserData(decodedUserData);
        setIsEditMode(true);
        setIsFullEdit(!!decodedUserData.isFullEdit && canSetPassword);
        setIsHead(decodedUserData.isHead || false);
        if (decodedUserData.id) {
          apiClient.get(`/auth/users/${decodedUserData.id}`).then((res) => {
            if (!res.ok) return;
            const assignments = res.data?.user?.accountantAssignments || [];
            const projectLevel = assignments
              .filter((a) => !a.sectionId)
              .map((a) => a.projectId);
            if (projectLevel.length) setSelectedProjectIds(projectLevel);
          }).catch(() => {});
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [searchParams]);



  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string().when([], {
      is: () => !isEditMode && canSetPassword,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(8, "Password must be at least 8 characters"),
      otherwise: (schema) =>
        schema.test(
          "optional-min",
          "Password must be at least 8 characters",
          (value) => !value || value.length >= 8,
        ),
    }),
  });
  
  const formik = useFormik({
    initialValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      role: userData?.role || "",
      isHead: false,
      note: userData?.note || "",
      password: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode && isFullEdit) {
        try {
          setLoading(true);
          const payload = {
            name: values.name,
            email: values.email,
            notes: values.note || undefined,
            ...(values.password ? { password: values.password } : {}),
          };
          const response = await apiClient.put(
            `/auth/users/${userData.id}`,
            payload,
          );
          if (!response.ok) {
            toast.error(response.data?.message || "Failed to update user");
            return;
          }
          if (values.role && values.role !== userData.role) {
            const effectiveIsHead = isHead || isHeadOfficeAccountant;
            await apiClient.patch(`/auth/users/${userData.id}/change-role`, {
              newRole: values.role,
              isHead: effectiveIsHead,
              isHeadOffice: isHeadOfficeAccountant,
              ...((effectiveIsHead &&
                (values.role === "ACCOUNTANT" ||
                  values.role === "STORE_INCHARGE") &&
                !isHeadOfficeAccountant) && { projectIds: selectedProjectIds }),
            });
          }
          toast.success("User updated successfully!");
          navigate(-1);
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Failed to update user.",
          );
        } finally {
          setLoading(false);
        }
        return;
      }

      if (isEditMode) {
        setShowConfirmModal(true);
      } else {
        try {
          setLoading(true);

          const effectiveIsHead = isHead || isHeadOfficeAccountant;

          if (
            formik.values.role === "ACCOUNTANT" &&
            !isHeadOfficeAccountant &&
            effectiveIsHead &&
            selectedProjectIds.length === 0
          ) {
            toast.error("Please assign at least one project for the Project Accountant.");
            setLoading(false);
            return;
          }

          if (effectiveIsHead && formik.values.role === "STORE_INCHARGE" && selectedProjectIds.length === 0) {
            toast.error("Please assign at least one project for the Head user.");
            setLoading(false);
            return;
          }

          const payload = {
            ...values,
            isHead: effectiveIsHead,
            isHeadOffice: isHeadOfficeAccountant,
            ...((effectiveIsHead &&
              (values.role === "ACCOUNTANT" || values.role === "STORE_INCHARGE") &&
              !isHeadOfficeAccountant) && { projectIds: selectedProjectIds }),
            ...(isHeadOfficeAccountant && { isHeadOffice: true }),
            ...(canSetPassword && values.password
              ? { password: values.password }
              : {}),
          };
          delete payload.isHead;
          // keep isHead in payload properly
          payload.isHead = effectiveIsHead;
          if (!canSetPassword) delete payload.password;

          const response = await apiClient.post("/auth/register", payload);

          if (response.ok) {
            resetForm();
            toast.success(response.data?.message || "User created successfully!");
            navigate(-1);
          } else {
            toast.error(response.data?.message || "User creation failed!");
          }
        } catch (error) {
          console.error(error);
          toast.error(
            error?.response?.data?.message ||
              "Operation failed. Please try again."
          );
        } finally {
          setLoading(false);
        }
      }
    },
  });

  // Handle role update confirmation
  const handleConfirmRoleUpdate = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const effectiveIsHead = isHead || isHeadOfficeAccountant;

      if (
        formik.values.role === "ACCOUNTANT" &&
        !isHeadOfficeAccountant &&
        effectiveIsHead &&
        selectedProjectIds.length === 0
      ) {
        toast.error("Please assign at least one project for the Project Accountant.");
        setLoading(false);
        return;
      }

      if (effectiveIsHead && formik.values.role === "STORE_INCHARGE" && selectedProjectIds.length === 0) {
        toast.error("Please assign at least one project for the Head user.");
        setLoading(false);
        return;
      }

      const payload = {
        newRole: formik.values.role,
        isHead: effectiveIsHead,
        isHeadOffice: isHeadOfficeAccountant,
        ...((effectiveIsHead &&
          (formik.values.role === "ACCOUNTANT" || formik.values.role === "STORE_INCHARGE") &&
          !isHeadOfficeAccountant) && { projectIds: selectedProjectIds }),
      };

      const response = await apiClient.patch(`/auth/users/${userData.id}/change-role`, payload);

      if (response.ok) {
        toast.success("User role updated successfully!");
        navigate(-1);
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to update user role. Please try again."
      );
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
        title={
          isFullEdit
            ? "Edit User"
            : isEditMode
              ? "Change User Role"
              : "New User"
        }
        detail={
          isFullEdit
            ? "Update User Details in RADC"
            : isEditMode
              ? "Update User Role in RADC"
              : "Add New User Information in RADC"
        }
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* form */}
      <div className="flex justify-center">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <CustomTextField
            label={<span className="flex items-center gap-1">User Name</span>}
            fullWidth
            name="name"
            placeholder="Enter Your Name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={isEditMode && !isFullEdit}
            sx={
              isEditMode && !isFullEdit
                ? {
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#666",
                    },
                  }
                : {}
            }
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Enter Email</span>}
            fullWidth
            name="email"
            placeholder="Enter Your Work Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={isEditMode && !isFullEdit}
            sx={
              isEditMode && !isFullEdit
                ? {
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#666",
                    },
                  }
                : {}
            }
          />{" "}
          {(!isEditMode && canSetPassword) || isFullEdit ? (
            <CustomTextField
              label={
                <span className="flex items-center gap-1">
                  {isFullEdit ? "Password (Optional)" : "Password"}
                </span>
              }
              fullWidth
              name="password"
              placeholder={
                isFullEdit
                  ? "Leave blank to keep current password"
                  : "Set password (min 8 characters)"
              }
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                (formik.touched.password && formik.errors.password) ||
                (!isEditMode
                  ? "User can log in immediately — welcome email with password is skipped."
                  : " ")
              }
            />
          ) : null}
          <CustomTextField
            label={<span className="flex items-center gap-1">Enter Note (Optional)</span>}
            fullWidth
            name="note"
            placeholder="Enter Note"
            type="text"
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isEditMode && !isFullEdit}
            sx={
              isEditMode && !isFullEdit
                ? {
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#666",
                    },
                  }
                : {}
            }
          />{" "}
          <div className="w-full">
            <CustomSelect
              label="Select Role"
              name="role"
              select
              value={formik.values.role}
              onChange={e => {
                formik.handleChange(e);
                const selectedRole = e.target.value;
                setIsHead(false);
                setIsHeadOfficeAccountant(false);
                setSelectedProjectIds([]);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="SITE_INCHARGE">Site Incharge</MenuItem>
              <MenuItem value="PROJECT_MANAGER">Project Manager</MenuItem>
              <MenuItem value="CONSTRUCTION_MANAGER">
                Construction Manager
              </MenuItem>
              <MenuItem value="STORE_INCHARGE">Store Incharge</MenuItem>
              <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
            </CustomSelect>
            {(formik.values.role === "STORE_INCHARGE" || formik.values.role === "ACCOUNTANT") && (
              <>
                {formik.values.role === "ACCOUNTANT" && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isHeadOfficeAccountant}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsHeadOfficeAccountant(checked);
                          if (checked) {
                            setIsHead(true);
                            setSelectedProjectIds(projects.map((p) => p.id));
                          } else {
                            setIsHead(false);
                            setSelectedProjectIds([]);
                          }
                        }}
                        color="primary"
                      />
                    }
                    label="Head Office Accountant (all projects)"
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isHead && !isHeadOfficeAccountant}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsHeadOfficeAccountant(false);
                        setIsHead(checked);
                        if (!checked) setSelectedProjectIds([]);
                      }}
                      color="primary"
                    />
                  }
                  label={
                    formik.values.role === "ACCOUNTANT"
                      ? "Project Accountant (Head)"
                      : "Is Head ?"
                  }
                />
              </>
            )}
            {/* Project assignment — required when Project Accountant / Head Store Incharge */}
            {(formik.values.role === "ACCOUNTANT" || formik.values.role === "STORE_INCHARGE") &&
              isHead &&
              !isHeadOfficeAccountant && (
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="head-accountant-projects-label">
                  Assign Projects (required) *
                </InputLabel>
                <Select
                  labelId="head-accountant-projects-label"
                  multiple
                  value={selectedProjectIds}
                  onChange={(e) => setSelectedProjectIds(e.target.value)}
                  input={<OutlinedInput label="Assign Projects (required) *" />}
                  renderValue={(selected) =>
                    projects
                      .filter((p) => selected.includes(p.id))
                      .map((p) => p.name)
                      .join(", ")
                  }
                  error={isHead && selectedProjectIds.length === 0}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      <Checkbox checked={selectedProjectIds.includes(project.id)} />
                      <ListItemText primary={project.name} />
                    </MenuItem>
                  ))}
                </Select>
                {isHead && selectedProjectIds.length === 0 && (
                  <FormHelperText error>
                    Select at least one project for the Project Accountant
                  </FormHelperText>
                )}
                <FormHelperText>
                  {formik.values.role === "ACCOUNTANT"
                    ? "This user becomes the Project Accountant for the selected project(s) and all of their sections. Petty cash is limited to amounts already funded by Admin or Head Office Accountant."
                    : "Head user access is limited to selected project(s) only."}
                </FormHelperText>
              </FormControl>
            )}
            {formik.values.role === "ACCOUNTANT" && isHeadOfficeAccountant && (
              <FormHelperText sx={{ mx: 0 }}>
                Head Office Accountant can fund and manage petty cash for all projects and their sections.
              </FormHelperText>
            )}
          </div>
          {isEditMode && !isFullEdit && (
            <span className="text-sm text-gray-500">
              Only the role can be changed. Other fields are read-only.
            </span>
          )}
          {isEditMode && isFullEdit && (
            <span className="text-sm text-gray-500">
              Update user details. Leave password blank to keep the current password.
            </span>
          )}
          {!isEditMode && !canSetPassword && (
            <span className="text-sm text-gray-500">User will get the Password through Email and login to the system.</span>
          )}
          {!isEditMode && canSetPassword && (
            <span className="text-sm text-gray-500">
              Set a password to create the user ready to login — welcome email with password is skipped.
            </span>
          )}

        </div>
      </div>{" "}
      <div className="flex gap-4 w-full justify-center mt-8">
        <button
          className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000] "
          onClick={() => navigate(-1)}
        >
          Back
        </button>
                 <button
           type="button"
           className="bg-primary  px-10 py-2 rounded-lg font-medium text-white "
           onClick={formik.handleSubmit}
           disabled={loading}
         >
           {loading
             ? "Saving..."
             : isEditMode
               ? isFullEdit
                 ? "Update User"
                 : "Update Role"
               : "Save User"}
         </button>
      </div>

             {/* Confirmation Modal for Role Update */}
       {showConfirmModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
             <h3 className="text-lg font-semibold mb-4">Confirm Role Change</h3>
             <div className="text-center mb-6">
               <p className="mb-4">
                 Are you sure you want to change the role for <strong>{userData?.name}</strong>?
               </p>
               <p className="text-sm text-gray-600 mb-4">
                 This action will update the user's role from <strong>{userData?.role}</strong> to <strong>{formik.values.role}</strong>.
                 This will remove all the associations of the user from respective project, demands, Stores etc.
               </p>
             </div>
             <div className="flex gap-3 justify-end">
               <button
                 onClick={() => setShowConfirmModal(false)}
                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
               >
                 Cancel
               </button>
               <button
                 onClick={handleConfirmRoleUpdate}
                 className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                 disabled={loading}
               >
                 {loading ? "Updating..." : "Confirm"}
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default AddUser;
