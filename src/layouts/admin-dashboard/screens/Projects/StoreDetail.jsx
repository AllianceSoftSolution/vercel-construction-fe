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
import AddMemberModal from "../users/modals/AddMemberModal";
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


  const columns = [
    { headerName: "Material", field: "material" },
    { headerName: "Linked Demand", field: "linkedDemand" },
    { headerName: "PO Quantity", field: "poQuantity" },
    { headerName: "Received", field: "received" },
    { headerName: "Issued", field: "issued" },
    { headerName: "Balance", field: "balance" },
    { headerName: "Last Updated", field: "lastUpdated" },
    { headerName: "Vendor", field: "vendor" },
    { headerName: "Status", field: "status" },
  ];


  const columns1 = [
    { headerName: "Material", field: "material" },
    { headerName: "Date", field: "date" },
    { headerName: "Type", field: "type" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Handled By", field: "handledBy" },
    { headerName: "Remarks", field: "remarks" },
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

  return (
    <>
    {loading ? (
        <Loader />
      ) : (
        <>
      <TopBar
        title="Store Detail"
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
          <InfoRow label="Store ID:" value={storeData?.id || "-"} />
          <InfoRow label="Store Name:" value={storeData?.name || "-"} />
          <InfoRow
            label="Project:"
            value={storeData?.section?.name?.split(" of ")[1] || "-"}
          />
          <InfoRow label="Section:" value={storeData?.section?.name || "-"} />
          <InfoRow
            label="Material:"
            value={storeData?.inventory?.[0]?.material || "N/A"}
          />{" "}
          <InfoRow
            label="Store Incharge:"
            value={storeData?.storeInchargeAssignments?.[0]?.user?.name || "N/A"}
          />
        </div>
      </div>
      {/* Head Store Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Head Store Assignments</h4>
      <SimpleTable
        data={(storeData?.storeInchargeAssignments || []).map(a => ({
          id: a.id,
          userName: a.user?.name || "-",
          email: a.user?.email || "-",
          role: a.user?.role || "-",
          createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "-",
        }))}
        columns={[
          { headerName: "Assignment ID", field: "id" },
          { headerName: "Store Incharge Name", field: "userName" },
          { headerName: "Email", field: "email" },
          { headerName: "Role", field: "role" },
          { headerName: "Assigned At", field: "createdAt" },
        ]}
        cellComponents={{}}
      />
      {/* Inventory Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Inventory</h4>
      {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable
       data={storeData?.inventory || []} 
      columns={columns} 
      cellComponents={{}} />{" "}
      {/* Stock Movement Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Stock Movement History
      </h4>
      {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable
        data={storeData?.transactions || []}
        columns={columns1}
        cellComponents={{}}
      />{" "}
      </>
      )}
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
