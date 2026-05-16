import React, { useEffect, useState } from "react";
import MembersOverviewCard from "../../../../mui/MembersOverviewCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import Loader from "../../../../components/ui/Loader";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
  borderRadius: "50px",
};

const SiStoreDetail = () => {
  const [storeData, setStoreData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStoreIncharge, setSelectedStoreIncharge] = useState(null);
  const [loading, setLoading] = useState(false);
 

  // Helper function to format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to format role display
  const formatRole = (role) => {
    if (!role) return '-';
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Preprocess inventory and transactions for flat fields
  const inventoryTableData = (storeData?.inventory || [])
    .filter((item) => item && typeof item === "object" && item.id)
    .map(item => ({
      ...item,
      materialName: item.material?.name || '-',
      unit: item.material?.unit || '-',
      updatedAtFormatted: formatDate(item.updatedAt),
    }));

  const transactionsTableData = (storeData?.transactions || [])
    .filter((item) => item && typeof item === "object" && item.id)
    .map(item => {
      const inv = (storeData?.inventory || [])
        .filter((inv) => inv && typeof inv === "object" && inv.materialId)
        .find(inv => inv.materialId === item.materialId);
      return {
        ...item,
        materialName: inv?.material?.name || item.materialId || '-',
        transactionDateFormatted: formatDate(item.transactionDate),
        flowStore: item.type === 'OUT'
          ? (item.toStore ? `→ ${item.toStore.name}` : '—')
          : item.type === 'IN'
          ? (item.fromStore ? `← ${item.fromStore.name}` : '—')
          : '—',
        documentUrl: item.documentUrl || null,
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

  const ViewDocumentCell = ({ value }) => {
    if (!value) return <span className="text-gray-400 text-sm">—</span>;
    return (
      <button
        onClick={() => window.open(value, "_blank", "noopener,noreferrer")}
        className="bg-[#BF1017] hover:bg-[#a00e14] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap"
      >
        View Document
      </button>
    );
  };

  const columns1 = [
    { headerName: "Material", field: "materialName" },
    { headerName: "Type", field: "type" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Flow (From/To)", field: "flowStore" },
    { headerName: "Reference", field: "reference" },
    { headerName: "Notes", field: "notes" },
    { headerName: "Date", field: "transactionDateFormatted" },
    { headerName: "Document", field: "documentUrl" },
  ];

  const stockIn = [
    { id: "1", label: "PO ( Purchase Order )" },
    { id: "2", label: "QTY ( Quantity )" },
    { id: "3", label: "Note" },
    { id: "4", label: "Product" },
  ];

  const stockOut = [
    { id: "1", label: "Material" },
    { id: "2", label: "QTY ( Quantity )" },
    { id: "3", label: "CM ( Construction Manager )" },
    { id: "4", label: "Note" },
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
      stockInType: "",
      documentFile: null,
    });
    // Stock Out form state
    const [stockOutForm, setStockOutForm] = useState({
      material: "",
      qty: "",
      note: "",
      stockOutType: "",
      documentFile: null,
    });
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [materialsLoading, setMaterialsLoading] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [poLoading, setPoLoading] = useState(false);

    const handleOpen = async (type) => {
      setModalType(type);
      setOpen(true);
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
      // Always fetch POs for stock in modal (so PO dropdown is ready if needed)
      if (type === "stock-in") {
        setPoLoading(true);
        try {
          const res = await apiClient.get("/purchase-orders");
          if (res.ok) {
            console.log("PO API response:", res.data);
            const poList = res.data.data || [];
            setPurchaseOrders(poList);
          } else {
            toast.error("Failed to load purchase orders");
          }
        } catch (err) {
          toast.error("Error loading purchase orders");
        } finally {
          setPoLoading(false);
        }
      }
    };
    const handleClose = () => {
      setOpen(false);
      setModalType("");
      setStockInForm({ po: "", qty: "", note: "", materialId: "", stockInType: "", documentFile: null });
      setStockOutForm({ material: "", qty: "", note: "", stockOutType: "", documentFile: null });
    };

    const handleStockInChange = (field, value) => {
      setStockInForm((prev) => ({ ...prev, [field]: value }));
    };
    const handleStockOutChange = (field, value) => {
      setStockOutForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleStockInSubmit = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('materialId', stockInForm.materialId);
        formData.append('quantity', stockInForm.qty);
        if (stockInForm.note) formData.append('notes', stockInForm.note);
        if (stockInForm.stockInType) formData.append('stockInType', stockInForm.stockInType);
        if (stockInForm.stockInType === 'PO' && stockInForm.po) {
          formData.append('poReferenceNumber', stockInForm.po);
        }
        if (stockInForm.documentFile) {
          formData.append('document', stockInForm.documentFile);
        }
        const res = await apiClient.post(`/stores/${id}/stock-in`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
    const handleStockOutSubmit = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('materialId', stockOutForm.material);
        formData.append('quantity', stockOutForm.qty);
        if (stockOutForm.note) formData.append('notes', stockOutForm.note);
        if (stockOutForm.stockOutType) formData.append('stockOutType', stockOutForm.stockOutType);
        if (stockOutForm.documentFile) {
          formData.append('document', stockOutForm.documentFile);
        }
        const res = await apiClient.post(`/stores/${id}/stock-out`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.ok) {
          toast.success("Stock Out successful!");
          handleClose();
          if (typeof fetchStoreDetail === 'function') fetchStoreDetail();
        } else {
          toast.error(res.data?.message || "Stock Out failed");
        }
      } catch (err) {
        toast.error(err.message || "Stock Out error");
      } finally {
        setLoading(false);
      }
    };

    // If stockInType changes to 'PO', fetch POs if not already loaded
    useEffect(() => {
      if (open && modalType === 'stock-in' && stockInForm.stockInType === 'PO' && purchaseOrders.length === 0 && !poLoading) {
        setPoLoading(true);
        apiClient.get('/purchase-orders').then(res => {
          if (res.ok) {
            const poList = res.data.data || [];
            setPurchaseOrders(poList);
          } else {
            toast.error('Failed to load purchase orders');
          }
        }).catch(() => {
          toast.error('Error loading purchase orders');
        }).finally(() => {
          setPoLoading(false);
        });
      }
    }, [open, modalType, stockInForm.stockInType]);

    return (
      <>
        <DropdownButton
          className="bg-[#FF0000] font-semibold"
          items={[
            { label: "Stock In", onClick: () => handleOpen("stock-in") },
            { label: "Stock Out", onClick: () => handleOpen("stock-out") },
          ]}
        >
          <IconButton>
            <BsThreeDotsVertical />
          </IconButton>
        </DropdownButton>

        <Modal
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
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#222222] mb-2">
                {modalType === "stock-in" ? "Stock In" : "Stock Out"}
              </h1>

              {modalType === "stock-in" ? (
                materialsLoading ? (
                  <div className="text-center py-4">Loading materials...</div>
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
                      label="QTY ( Quantity )"
                      value={stockInForm.qty}
                      type="number"
                      onChange={e => handleStockInChange("qty", e.target.value)}
                    />
                    <CustomTextField
                      fullWidth
                      margin="normal"
                      label="Note"
                      value={stockInForm.note}
                      onChange={e => handleStockInChange("note", e.target.value)}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Attachment (Optional)</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <label
                          htmlFor="doc-upload-stock-in"
                          className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center gap-2 transition"
                        >
                          <span>📎</span>
                          <span>Choose File</span>
                        </label>
                        <input
                          id="doc-upload-stock-in"
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          className="hidden"
                          onChange={e => handleStockInChange("documentFile", e.target.files?.[0] || null)}
                        />
                        <span className="text-sm text-gray-500 truncate max-w-[180px]">
                          {stockInForm.documentFile ? stockInForm.documentFile.name : "No file chosen"}
                        </span>
                        {stockInForm.documentFile && (
                          <button
                            type="button"
                            className="text-red-500 text-xs"
                            onClick={() => handleStockInChange("documentFile", null)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                    <CustomSelect
                      label="Type"
                      name="stockInType"
                      value={stockInForm.stockInType}
                      onChange={e => handleStockInChange("stockInType", e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="PO">Po</MenuItem>
                      <MenuItem value="INITIAL">Initial</MenuItem>
                      <MenuItem value="TRANSFER">Transfer</MenuItem>
                      <MenuItem value="MANUAL">Manual </MenuItem>
                    </CustomSelect>
                    {/* Show PO dropdown if Type is PO */}
                    {stockInForm.stockInType === 'PO' && (
                      <CustomSelect
                        label="PO Reference Number"
                        name="poReferenceNumber"
                        value={stockInForm.po}
                        onChange={e => handleStockInChange("po", e.target.value)}
                        fullWidth
                        disabled={poLoading}
                      >
                        <MenuItem value="">Select PO Reference</MenuItem>
                        {purchaseOrders
                          .filter(po => po && po.referenceNumber)
                          .map((po) => (
                            <MenuItem key={po.referenceNumber} value={po.referenceNumber}>
                              {po.referenceNumber}
                            </MenuItem>
                          ))}
                      </CustomSelect>
                    )}
                  </>
                )
              ) : materialsLoading ? (
                <div className="text-center py-4">Loading materials...</div>
              ) : (
                <>
                  <CustomSelect
                    label="Material"
                    name="materialId"
                    value={stockOutForm.material}
                    onChange={e => handleStockOutChange("material", e.target.value)}
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
                    label="QTY ( Quantity )"
                    type="number"
                    name="qty"
                    value={stockOutForm.qty}
                    onChange={e => handleStockOutChange("qty", e.target.value)}
                  />
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="Note"
                    type="text"
                    name="note"
                    value={stockOutForm.note}
                    onChange={e => handleStockOutChange("note", e.target.value)}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Attachment (Optional)</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <label
                        htmlFor="doc-upload-stock-out"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center gap-2 transition"
                      >
                        <span>📎</span>
                        <span>Choose File</span>
                      </label>
                      <input
                        id="doc-upload-stock-out"
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={e => handleStockOutChange("documentFile", e.target.files?.[0] || null)}
                      />
                      <span className="text-sm text-gray-500 truncate max-w-[180px]">
                        {stockOutForm.documentFile ? stockOutForm.documentFile.name : "No file chosen"}
                      </span>
                      {stockOutForm.documentFile && (
                        <button
                          type="button"
                          className="text-red-500 text-xs"
                          onClick={() => handleStockOutChange("documentFile", null)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                     <CustomSelect
                      label="Type"
                      name="stockOutType"
                      value={stockOutForm.stockOutType}
                      onChange={e => handleStockOutChange("stockOutType", e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="MANUAL">Manual </MenuItem>
                      <MenuItem value="LOSS">Loss</MenuItem>
                    </CustomSelect>
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
                  <Button
                    buttonText={loading ? "Saving..." : "Save"}
                    onClick={handleStockOutSubmit}
                    disabled={loading}
                  />
                )}
              </div>
            </div>
          </Box>
        </Modal>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

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
          <div className="flex items-center justify-between sm:flex-row gap-2  sm:items-center">
            <div className="text-white bg-[#BF1017] px-6 py-1.5 rounded-full text-sm">
              IN-STORE
            </div>
            <CustomActionComponent />
          </div>
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
          />
          <InfoRow
            label="Store Incharge:"
            value={storeData?.storeInchargeAssignments?.[0]?.user?.name || "N/A"}
          />
        </div>
      </div>
      {/* Head Store Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Head Store Assignments</h4>
      <SimpleTable
        data={(storeData?.storeInchargeAssignments || [])
          .filter((a) => a && typeof a === "object" && a.id)
          .map(a => ({
          id: a.id,
          userName: a.user?.name || "-",
          email: a.user?.email || "-",
          role: formatRole(a.user?.role),
          createdAt: formatDate(a.createdAt),
        }))}
        columns={[
          // { headerName: "Assignment ID", field: "id" },
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
      <SimpleTable data={inventoryTableData} 
        columns={columns}
        cellComponents={{}}/>
      {/* Stock Movement Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Stock Movement History
      </h4>
      {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable
        data={transactionsTableData}
        columns={columns1}
        cellComponents={{ documentUrl: ViewDocumentCell }}
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

export default SiStoreDetail;
