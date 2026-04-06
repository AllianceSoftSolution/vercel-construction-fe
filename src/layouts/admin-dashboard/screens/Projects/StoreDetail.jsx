import React, { useEffect, useState } from "react";
import MembersOverviewCard from "../../../../mui/MembersOverviewCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { Box, IconButton, Modal } from "@mui/material";
import Search from "../../../../../src/assets/construction/Search.png";
import manager from "../../../../../src/assets/construction/manager.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import { Check } from "@mui/icons-material";
import CustomTextField from "../../../../mui/CustomTextField";
import Button from "../../../../components/Button";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import AssignMemberModal from "../../../../components/AssignMemberModal";
import CustomSelect from "../../../../mui/CustomSelect";
import MenuItem from "@mui/material/MenuItem";
import Loader from "../../../../components/ui/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
  borderRadius: "50px",
};

const StoreDetail = () => {
  const [storeData, setStoreData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStoreIncharge, setSelectedStoreIncharge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAssignStoreInchargeModal, setOpenAssignStoreInchargeModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Transform inventory data for table display
  const inventoryTableData = (storeData?.inventory || []).map((item) => ({
    ...item,
    materialName: item.material?.name || "-",
    unit: item.material?.unit || "-",
    updatedAtFormatted: formatDate(item.updatedAt),
  }));

  // Transform transactions data for table display
  const transactionsTableData = (storeData?.transactions || []).map((item) => {
    const inv = (storeData?.inventory || []).find(
      (inv) => inv.materialId === item.materialId
    );
    return {
      ...item,
      materialName: inv?.material?.name || item.materialId || "-",
      transactionDateFormatted: formatDate(item.transactionDate),
    };
  });

  const columns = [
    { headerName: "Material", field: "materialName" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Stock", field: "stock" },
    { headerName: "Reserved", field: "reserved" },
    { headerName: "Available", field: "available" },
    { headerName: "Last Updated", field: "updatedAtFormatted" },
  ];


  const columns1 = [
    { headerName: "Material", field: "materialName" },
    { headerName: "Type", field: "type" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Reference", field: "reference" },
    { headerName: "Notes", field: "notes" },
    { headerName: "Date", field: "transactionDateFormatted" },
  ];


  const CustomActionComponent = () => {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    // Stock In form state
    const [stockInForm, setStockInForm] = useState({
      po: "",
      qty: "",
      note: "",
      materialId: "",
    });
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [materialsLoading, setMaterialsLoading] = useState(false);

    const handleOpen = async (type) => {
      setModalType(type);
      setOpen(true);
      if (type === "stock-in") {
        setMaterialsLoading(true);
        try {
          const res = await apiClient.get("/materials");
          if (res.ok) {
            setMaterials(res.data.materials || []);
          } else {
            toast.error("Failed to load materials");
          }
        } catch (err) {
          toast.error("Error loading materials");
        } finally {
          setMaterialsLoading(false);
        }
      }
    };
    const handleClose = () => {
      setOpen(false);
      setModalType("");
      setStockInForm({ po: "", qty: "", note: "", materialId: "" });
    };

    const handleStockInChange = (field, value) => {
      setStockInForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleStockInSubmit = async () => {
      setLoading(true);
      try {
        const res = await apiClient.post(`/stores/${id}/stock-in`, {
          materialId: stockInForm.materialId,
          quantity: stockInForm.qty,
          notes: stockInForm.note,
          po: stockInForm.po,
        });
        if (res.ok) {
          toast.success("Stock In successful!");
          handleClose();
          if (typeof fetchStoreDetail === 'function') fetchStoreDetail();
        } else {
          toast.error(res.data?.message || "Stock In failed");
        }
      } catch (err) {
        toast.error(err.message || "Stock In error");
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        {/* <DropdownButton
          className="bg-[#FF0000] font-semibold"
          items={[
            { label: "Stock In", onClick: () => handleOpen("stock-in") },
            { label: "Stock Out", onClick: () => handleOpen("stock-out") },
          ]}
        >
          <IconButton>
            <BsThreeDotsVertical />
          </IconButton>
        </DropdownButton> */}

        {/* <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%", // Responsive width
              maxWidth: 500, // Limit max width
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "12px",
              p: { xs: 2, sm: 4 }, // Padding varies by screen size
            }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#222222] mb-2">
                {modalType === "stock-in" ? "Stock In" : "Stock Out"}
              </h1>

              {modalType === "stock-in" ? (
                materialsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader />
                  </div>
                ) : (
                  <>
                    <CustomSelect
                      label="Material"
                      name="materialId"
                      value={stockInForm.materialId}
                      onChange={e => handleStockInChange("materialId", e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="">Select Material</MenuItem>
                      {materials.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                    <CustomTextField
                      fullWidth
                      margin="normal"
                      label="PO ( Purchase Order )"
                      value={stockInForm.po}
                      onChange={e => handleStockInChange("po", e.target.value)}
                    />
                    <CustomTextField
                      fullWidth
                      margin="normal"
                      label="QTY ( Quantity )"
                      value={stockInForm.qty}
                      onChange={e => handleStockInChange("qty", e.target.value)}
                    />
                    <CustomTextField
                      fullWidth
                      margin="normal"
                      label="Note"
                      value={stockInForm.note}
                      onChange={e => handleStockInChange("note", e.target.value)}
                    />
                  </>
                )
              ) : (
                <>
                  <CustomTextField fullWidth margin="normal" label="Material" />
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="QTY ( Quantity )"
                  />
                  <CustomTextField fullWidth margin="normal" label="Note" />
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="CM ( Construction Manager )"
                  />
                </>
              )}

              <div className="mt-4 flex justify-end">
                {modalType === "stock-in" ? (
                  <Button
                    buttonText={loading ? "Saving..." : "Save"}
                    onClick={handleStockInSubmit}
                    disabled={loading || materialsLoading}
                  />
                ) : (
                  <Button buttonText={"Save"} onClick={handleClose} />
                )}
              </div>
            </div>
          </Box>
        </Modal> */}
      </>
    );
  };
  const { id } = useParams();
  const fetchStoreDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/stores/${id}`);
      if (response.ok) {
        setStoreData(response.data.store);
        setSelectedStoreIncharge(response.data.store?.storeInchargeAssignments?.[0]?.user || null);
      } else {
        toast.error("Failed to fetch Store details.");
      }
    } catch (error) {
      console.error("Error fetching Store details:", error);
      toast.error("Something went wrong while fetching details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStoreDetail();
  }, [id]);

  // Format text for display (roles, types, etc.)
  const formatText = (text) => {
    if (!text) return "-";
    
    // Convert text to title case and replace underscores with spaces
    return text
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handler for adding and assigning a new Store Incharge
  const handleAddStoreIncharge = async (data) => {
    try {
      const response = await apiClient.post("/auth/register", { ...data, role: "STORE_INCHARGE" });
      if (response.ok) {
        toast.success("Store Incharge added successfully!");
        // Assign the new user as Store Incharge
        const assignRes = await apiClient.post(`/stores/${id}/assign-store-incharge`, { userId: response.data.user.id });
        if (assignRes.ok) {
          toast.success("Store Incharge assigned successfully!");
          fetchStoreDetail();
          setShowModal(false);
        } else {
          toast.error(assignRes.data?.message || "Failed to assign Store Incharge");
        }
      } else {
        toast.error(response.data?.message || "Failed to add Store Incharge");
      }
    } catch (error) {
      toast.error(error.message || "Error adding Store Incharge");
    }
  };

 
  const fetchStoreInchargeUsers = async () => {
    try {
      // Use sectionId instead of projectId for fetching store incharge users
      const sectionId = storeData?.sectionId || storeData?.section?.id;
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: "STORE_INCHARGE",
        sectionId: sectionId,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const createStoreInchargeUser = async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: "STORE_INCHARGE",
      });
      if (response.ok && response.data?.user) {
        toast.success("User created successfully");
        return response.data.user;
      }
      toast.error(response.data?.message || "Failed to create user");
      return null;
    } catch (e) {
      toast.error("Failed to create user");
      return null;
    }
  };

  const handleAssignStoreInchargeGeneric = async ({ userId }) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post(`/assignments/store-incharge`, {
        userId,
        storeId: id,
      });
      if (response.ok) {
        toast.success("Store Incharge assigned successfully!");
        fetchStoreDetail();
        setOpenAssignStoreInchargeModal(false);
        return true;
      } else {
        toast.error(
          response.data?.message || "Failed to assign Store Incharge"
        );
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign Store Incharge");
      return false;
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TopBar
            title="Store Detail"
            showIcon={true}
          // detail="lorem ipsum dolor sit amet"
          // showExport={true}
          // buttonText="Add Store"
          />
          <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-y-2">
              <p className="text-[#444444] font-semibold text-lg md:text-xl">
                {storeData?.name || "Order Name Here"}
              </p>
              {/* <div className="flex items-center justify-between sm:flex-row gap-2  sm:items-center">
            <div className="text-white bg-[#BF1017] px-6 py-1.5 rounded-full text-sm">
              IN-STORE
            </div>
            <CustomActionComponent />
          </div> */}
            </div>

            <div className="h-[1px] bg-[#CDCDCD] w-full "></div>

            <div className="flex justify-between gap-x-4 flex-wrap">
              {/* <InfoRow label="Store ID:" value={storeData?.id || "-"} /> */}
              <InfoRow label="Store Name:" value={storeData?.name || "-"} />
              <InfoRow
                label="Project:"
                value={storeData?.section?.project?.name || "-"}
              />
              <InfoRow label="Section:" value={storeData?.section?.name || "-"} />
              <InfoRow
                label="Material:"
                value={storeData?.inventory?.[0]?.material?.name || "N/A"}
              />{" "}
              <InfoRow
                label="Store Incharge:"
                value={storeData?.storeInchargeAssignments?.[0]?.user?.name || "N/A"}
              />
            </div>
          </div>
          {/* Head Store Table */}
          <div className="mt-10">
          <TopBar
            title="Store Incharge "
            buttonText="Add Store Incharge"
            onButtonClick={() => setOpenAssignStoreInchargeModal(true)}
            />
                     <SimpleTable
             data={(storeData?.storeInchargeAssignments || []).map(a => ({
               id: a.id,
               userName: a.user?.name || "-",
               email: a.user?.email || "-",
               role: formatText(a.user?.role) || "Store Incharge",
               createdAt: formatDate(a.createdAt),
             }))}
             columns={[
              //  { headerName: "Assignment ID", field: "id" },
               { headerName: "Store Incharge Name", field: "userName" },
               { headerName: "Email", field: "email" },
               { headerName: "Role", field: "role" },
               { headerName: "Assigned At", field: "createdAt" },
             ]}
             cellComponents={{}}
           />
          </div>
        
          {/* Inventory Table */}
          <h4 className="mt-8 text-[#444444] font-semibold text-xl">Inventory</h4>
          {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
          <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
          <SimpleTable
            data={inventoryTableData}
            columns={columns}
            cellComponents={{}} />{" "}
          {/* Stock Movement Table */}
          <h4 className="mt-8 text-[#444444] font-semibold text-xl">
            Stock Movement History
          </h4>
          {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
          <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
          <SimpleTable
            data={transactionsTableData}
            columns={columns1}
            cellComponents={{}}
          />{" "}
        </>
      )}

      <AssignMemberModal
        role="Store Incharge"
        open={openAssignStoreInchargeModal}
        onClose={() => setOpenAssignStoreInchargeModal(false)}
        fetchUsers={fetchStoreInchargeUsers}
        createUser={createStoreInchargeUser}
        onAssign={handleAssignStoreInchargeGeneric}
      />
    </>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex gap-x-4 items-center mt-2">
    <p className="text-[#444444] font-semibold text-xl">{label}</p>
    <p className="text-[#979797]">{value}</p>
  </div>
);

export default StoreDetail;
