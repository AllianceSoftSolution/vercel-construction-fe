import React, { useState, useEffect, useCallback } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomSelect from "../../../../mui/CustomSelect";
import { MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import CustomModal from "../../../../comments/components/CustomModal";

const AddUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHead, setIsHead] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Check if we're in edit mode
  useEffect(() => {
    const userDataParam = searchParams.get('userData');
    if (userDataParam) {
      try {
        const decodedUserData = JSON.parse(decodeURIComponent(userDataParam));
        setUserData(decodedUserData);
        setIsEditMode(true);
        setIsHead(decodedUserData.isHead || false);
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
  });
  
  const formik = useFormik({
    initialValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      role: userData?.role || "",
      isHead: false,
      note: userData?.note || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode) {
        setShowConfirmModal(true);
      } else {
        try {
          setLoading(true);

          const payload = {
            ...values,
            isHead:
              values.role === "STORE_INCHARGE" ? true : isHead ? true : false,
          };
          const response = await apiClient.post("/auth/register", payload);

          if (response.ok) {
            resetForm();
            navigate(-1);
          } else {
            toast.error("User creation failed!");
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

      const payload = {
        newRole: formik.values.role,
        isHead: formik.values.role === "STORE_INCHARGE" ? true : isHead,
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
        title={isEditMode ? "Change User Role" : "New User"}
        detail={isEditMode ? "Update User Role in RADC" : "Add New User Information in RADC"}
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
            disabled={isEditMode}
            sx={isEditMode ? { "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#666" } } : {}}
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
            disabled={isEditMode}
            sx={isEditMode ? { "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#666" } } : {}}
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Enter Note (Optional)</span>}
            fullWidth
            name="note"
            placeholder="Enter Note"
            type="text"
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isEditMode}
            sx={isEditMode ? { "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#666" } } : {}}
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
                setIsHead(selectedRole === "STORE_INCHARGE");
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.role === "STORE_INCHARGE" ? true : isHead}
                    onChange={e => setIsHead(e.target.checked)}
                    disabled={formik.values.role === "STORE_INCHARGE"}
                    color="primary"
                  />
                }
                label="Is Head ?"
              />
            )}
          </div>
          {isEditMode && (
            <span className="text-sm text-gray-500">
              Only the role can be changed. Other fields are read-only.
            </span>
          )}
          {!isEditMode && (
            <span className="text-sm text-gray-500">User will get the Password through Email and login to the system.</span>
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
           {loading ? "Saving..." : (isEditMode ? "Update Role" : "Save User")}
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
