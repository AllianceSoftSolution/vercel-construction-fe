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
import { useSelector } from "react-redux";
import StoreMovementHistoryTable from "../../../../components/store/StoreMovementHistoryTable";
import { formatStoreDate } from "../../../../utils/storeTransactionHelpers";
import { isHeadUser } from "../../../../utils/userHelpers";
import FileUploadField from "../../../../components/ui/FileUploadField";
import useS3MultiUpload from "../../../../hooks/useS3MultiUpload";
import { UPLOAD_FOLDERS } from "../../../../constants/fileUpload";

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
  const [sectionStoreTxns, setSectionStoreTxns] = useState([]);

  const currentUser = useSelector((state) => state.auth.user);
  const isHeadStoreIncharge =
    currentUser?.role === "STORE_INCHARGE" && isHeadUser(currentUser);
  // Store type — used for table layout and incoming-transfer badges
  const isHeadStore = storeData?.type === "HEAD_STORE";

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
      updatedAtFormatted: formatStoreDate(item.updatedAt),
    }));

  const columns = [
    { headerName: "Material", field: "materialName" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Stock", field: "stock" },
    { headerName: "Reserved", field: "reserved" },
    { headerName: "Available", field: "available" },
    { headerName: "Last Updated", field: "updatedAtFormatted" },
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
      documentFiles: [],
    });
    // Stock Out form state
    const [stockOutForm, setStockOutForm] = useState({
      material: "",
      qty: "",
      note: "",
      stockOutType: "",
      toStoreId: "",
      documentFiles: [],
    });
    const [loading, setLoading] = useState(false);
    const { uploadFiles, uploading: fileUploading } = useS3MultiUpload();
    const [materials, setMaterials] = useState([]);
    const [materialsLoading, setMaterialsLoading] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [poLoading, setPoLoading] = useState(false);
    // Section stores for TRANSFER destination
    const [sectionStores, setSectionStores] = useState([]);
    const [sectionStoresLoading, setSectionStoresLoading] = useState(false);
    // Available balance in destination store for selected material
    const [destBalance, setDestBalance] = useState(null);

    // Get the project ID from the current store
    const projectId = storeData?.projectId || storeData?.section?.project?.id || null;

    const handleOpen = async (type) => {
      setModalType(type);
      setOpen(true);
      setMaterialsLoading(true);
      try {
        const res = await apiClient.get("/materials");
        if (res.ok) setMaterials(res.data.materials || []);
        else toast.error("Failed to load materials");
      } catch {
        toast.error("Error loading materials");
      } finally {
        setMaterialsLoading(false);
      }
      if (type === "stock-in") {
        setPoLoading(true);
        try {
          const res = await apiClient.get("/purchase-orders");
          if (res.ok) setPurchaseOrders(res.data.data || []);
          else toast.error("Failed to load purchase orders");
        } catch {
          toast.error("Error loading purchase orders");
        } finally {
          setPoLoading(false);
        }
      }
      // Head store incharge can transfer between head/section stores in the project
      if (type === "stock-out" && projectId && isHeadStoreIncharge) {
        setSectionStoresLoading(true);
        apiClient.get(`/stores?projectId=${projectId}`)
          .then((res) => {
            if (res.ok) {
              const stores = (res.data.stores || []).filter(
                (s) =>
                  s.id !== id &&
                  (s.type === "SECTION_STORE" || s.type === "HEAD_STORE")
              );
              setSectionStores(stores);
            } else {
              toast.error("Failed to load section stores");
            }
          })
          .catch(() => toast.error("Error loading section stores"))
          .finally(() => setSectionStoresLoading(false));
      }
    };

    const handleClose = () => {
      setOpen(false);
      setModalType("");
      setStockInForm({ po: "", qty: "", note: "", materialId: "", stockInType: "", documentFiles: [] });
      setStockOutForm({ material: "", qty: "", note: "", stockOutType: "", toStoreId: "", documentFiles: [] });
      setSectionStores([]);
      setDestBalance(null);
    };

    const handleStockInChange = (field, value) => setStockInForm((p) => ({ ...p, [field]: value }));
    const handleStockOutChange = (field, value) =>
      setStockOutForm((p) => {
        const next = { ...p, [field]: value };
        if (field === "stockOutType" && value !== "TRANSFER") {
          next.toStoreId = "";
        }
        return next;
      });

    // Section stores are now fetched in handleOpen — no need for a reactive useEffect here

    // Fetch destination store balance when toStoreId + material is selected
    useEffect(() => {
      if (stockOutForm.toStoreId && stockOutForm.material) {
        apiClient.get(`/stores/${stockOutForm.toStoreId}/inventory`)
          .then((res) => {
            if (res.ok) {
              const inv = (res.data.inventory || []).find(
                (i) => i.materialId === stockOutForm.material
              );
              setDestBalance(inv ? parseFloat(inv.available) : 0);
            }
          })
          .catch(() => setDestBalance(null));
      } else {
        setDestBalance(null);
      }
    }, [stockOutForm.toStoreId, stockOutForm.material]);

    // Fetch POs when type changes to PO
    useEffect(() => {
      if (open && modalType === "stock-in" && stockInForm.stockInType === "PO" && purchaseOrders.length === 0 && !poLoading) {
        setPoLoading(true);
        apiClient.get("/purchase-orders")
          .then((res) => {
            if (res.ok) setPurchaseOrders(res.data.data || []);
            else toast.error("Failed to load purchase orders");
          })
          .catch(() => toast.error("Error loading purchase orders"))
          .finally(() => setPoLoading(false));
      }
    }, [open, modalType, stockInForm.stockInType]);

    const handleStockInSubmit = async () => {
      if (!stockInForm.documentFiles.length) {
        toast.error("Attachment is required");
        return;
      }
      setLoading(true);
      try {
        const payload = {
          materialId: stockInForm.materialId,
          quantity: stockInForm.qty,
          notes: stockInForm.note || undefined,
          stockInType: stockInForm.stockInType || undefined,
          poReferenceNumber:
            stockInForm.stockInType === "PO" && stockInForm.po
              ? stockInForm.po
              : undefined,
          documentUrls: await uploadFiles(
            stockInForm.documentFiles,
            UPLOAD_FOLDERS.document
          ),
        };
        const res = await apiClient.post(`/stores/${id}/stock-in`, payload);
        if (res.ok) {
          toast.success("Stock In successful!");
          handleClose();
          if (typeof fetchStoreDetail === "function") fetchStoreDetail();
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
      if (stockOutForm.stockOutType === "TRANSFER" && !stockOutForm.toStoreId) {
        toast.error("Please select a destination store");
        return;
      }
      if (!stockOutForm.documentFiles.length) {
        toast.error("Attachment is required");
        return;
      }
      setLoading(true);
      try {
        const outType = stockOutForm.stockOutType || "MANUAL";
        const payload = {
          materialId: stockOutForm.material,
          quantity: stockOutForm.qty,
          notes: stockOutForm.note || undefined,
          stockOutType: outType,
          toStoreId:
            outType === "TRANSFER" && stockOutForm.toStoreId
              ? stockOutForm.toStoreId
              : undefined,
          documentUrls: await uploadFiles(
            stockOutForm.documentFiles,
            UPLOAD_FOLDERS.document
          ),
        };
        const res = await apiClient.post(`/stores/${id}/stock-out`, payload);
        if (res.ok) {
          toast.success("Stock Out successful!");
          handleClose();
          if (typeof fetchStoreDetail === "function") fetchStoreDetail();
        } else {
          toast.error(res.data?.message || "Stock Out failed");
        }
      } catch (err) {
        toast.error(err.message || "Stock Out error");
      } finally {
        setLoading(false);
      }
    };

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

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "12px",
              p: { xs: 2, sm: 4 },
              maxHeight: "85vh",
              overflowY: "auto",
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
                    <CustomSelect label="Material" name="materialId" value={stockInForm.materialId} onChange={(e) => handleStockInChange("materialId", e.target.value)} fullWidth>
                      <MenuItem value="">Select Material</MenuItem>
                      {materials.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                      ))}
                    </CustomSelect>
                    <CustomTextField fullWidth margin="normal" label="QTY ( Quantity )" value={stockInForm.qty} type="number" onChange={(e) => handleStockInChange("qty", e.target.value)} />
                    <CustomTextField fullWidth margin="normal" label="Note" value={stockInForm.note} onChange={(e) => handleStockInChange("note", e.target.value)} />
                    <FileUploadField
                      label="Attachment"
                      required
                      files={stockInForm.documentFiles}
                      onChange={(documentFiles) =>
                        setStockInForm((prev) => ({ ...prev, documentFiles }))
                      }
                      disabled={loading || fileUploading}
                    />
                    <CustomSelect label="Type" name="stockInType" value={stockInForm.stockInType} onChange={(e) => handleStockInChange("stockInType", e.target.value)} fullWidth>
                      <MenuItem value="PO">PO</MenuItem>
                      <MenuItem value="INITIAL">Initial</MenuItem>
                      <MenuItem value="TRANSFER">Transfer</MenuItem>
                      <MenuItem value="MANUAL">Manual</MenuItem>
                    </CustomSelect>
                    {stockInForm.stockInType === "PO" && (
                      <CustomSelect label="PO Reference Number" name="poReferenceNumber" value={stockInForm.po} onChange={(e) => handleStockInChange("po", e.target.value)} fullWidth disabled={poLoading}>
                        <MenuItem value="">Select PO Reference</MenuItem>
                        {purchaseOrders.filter((po) => po?.referenceNumber).map((po) => (
                          <MenuItem key={po.referenceNumber} value={po.referenceNumber}>{po.referenceNumber}</MenuItem>
                        ))}
                      </CustomSelect>
                    )}
                  </>
                )
              ) : materialsLoading ? (
                <div className="text-center py-4">Loading materials...</div>
              ) : (
                <>
                  <CustomSelect label="Material" name="materialId" value={stockOutForm.material} onChange={(e) => handleStockOutChange("material", e.target.value)} fullWidth>
                    <MenuItem value="">Select Material</MenuItem>
                    {materials.map((item) => (
                      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}
                  </CustomSelect>
                  <CustomTextField fullWidth margin="normal" label="QTY ( Quantity )" type="number" name="qty" value={stockOutForm.qty} onChange={(e) => handleStockOutChange("qty", e.target.value)} />

                  <CustomSelect
                    label="Type"
                    name="stockOutType"
                    value={stockOutForm.stockOutType}
                    onChange={(e) => handleStockOutChange("stockOutType", e.target.value)}
                    fullWidth
                  >
                    {isHeadStoreIncharge && <MenuItem value="TRANSFER">Transfer</MenuItem>}
                    <MenuItem value="MANUAL">Manual</MenuItem>
                    <MenuItem value="LOSS">Loss</MenuItem>
                  </CustomSelect>

                  {/* Head store incharge: pick destination when type is Transfer */}
                  {isHeadStoreIncharge && stockOutForm.stockOutType === "TRANSFER" && (
                    <>
                      <CustomSelect
                        label="Destination Store"
                        name="toStoreId"
                        value={stockOutForm.toStoreId}
                        onChange={(e) => handleStockOutChange("toStoreId", e.target.value)}
                        fullWidth
                        disabled={sectionStoresLoading}
                      >
                        <MenuItem value="">{sectionStoresLoading ? "Loading stores..." : "Select Destination Store"}</MenuItem>
                        {sectionStores.map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.name} ({s.type.replace(/_/g, " ")})
                          </MenuItem>
                        ))}
                      </CustomSelect>

                      {stockOutForm.toStoreId && stockOutForm.material && (
                        <div className={`text-sm px-3 py-2 rounded-lg font-medium ${destBalance === null ? "bg-gray-100 text-gray-500" : destBalance === 0 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-700"}`}>
                          {destBalance === null
                            ? "Checking destination balance…"
                            : `Destination store current balance: ${destBalance} units`}
                        </div>
                      )}
                    </>
                  )}

                  <CustomTextField fullWidth margin="normal" label="Note" type="text" name="note" value={stockOutForm.note} onChange={(e) => handleStockOutChange("note", e.target.value)} />
                  <FileUploadField
                    label="Attachment"
                    required
                    files={stockOutForm.documentFiles}
                    onChange={(documentFiles) =>
                      setStockOutForm((prev) => ({ ...prev, documentFiles }))
                    }
                    disabled={loading || fileUploading}
                  />
                </>
              )}

              <div className="mt-4 flex justify-end">
                {modalType === "stock-in" ? (
                  <Button buttonText={loading ? "Saving..." : "Save"} onClick={handleStockInSubmit} disabled={loading || materialsLoading} />
                ) : (
                  <Button buttonText={loading ? "Saving..." : "Save"} onClick={handleStockOutSubmit} disabled={loading} />
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
        const store = response.data.store;
        setStoreData(store);
        setSelectedStoreIncharge(store?.storeInchargeAssignments?.[0]?.user || null);
        // For HEAD stores: also load section store transactions for the combined history view
        if (store?.type === 'HEAD_STORE') {
          const projId = store.projectId;
          if (projId) {
            const storesRes = await apiClient.get(`/stores?projectId=${projId}`);
            if (storesRes.ok) {
              const secStores = (storesRes.data.stores || []).filter(
                (s) => s.type === 'SECTION_STORE'
              );
              const allSecTxns = [];
              for (const secStore of secStores) {
                const secRes = await apiClient.get(`/stores/${secStore.id}`);
                if (secRes.ok) {
                  const secDetail = secRes.data.store;
                  const secInv = secDetail?.inventory || [];
                  const txns = (secDetail?.transactions || [])
                    // Exclude transfers to/from this HEAD store — shown on head store's own rows.
                    .filter((t) => t.fromStoreId !== id && t.toStoreId !== id)
                    .map((t) => ({
                      transaction: t,
                      store: secStore,
                      storeName: secStore.name,
                      inventory: secInv,
                    }));
                  allSecTxns.push(...txns);
                }
              }
              allSecTxns.sort(
                (a, b) =>
                  new Date(b.transaction.transactionDate) -
                  new Date(a.transaction.transactionDate)
              );
              setSectionStoreTxns(allSecTxns);
            }
          }
        } else {
          setSectionStoreTxns([]);
        }
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
            {/* HEAD stores and SECTION stores can perform Stock In / Stock Out */}
            {(isHeadStore || storeData?.type === 'SECTION_STORE') && <CustomActionComponent />}
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
              tableTitle="store-incharge"
        data={(storeData?.storeInchargeAssignments || [])
          .filter((a) => a && typeof a === "object" && a.id)
          .map(a => ({
          id: a.id,
          userName: a.user?.name || "-",
          email: a.user?.email || "-",
          role: formatRole(a.user?.role),
          createdAt: formatStoreDate(a.createdAt),
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
      <SimpleTable
        tableTitle="store-inventory"
        data={inventoryTableData} 
        columns={columns}
        cellComponents={{}}/>
      {/* Stock Movement Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Stock Movement History
      </h4>
      {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <StoreMovementHistoryTable
        storeData={storeData}
        storeId={id}
        sectionStoreTxns={sectionStoreTxns}
        recordsPerPage={isHeadStore ? 5 : undefined}
        onRefresh={fetchStoreDetail}
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
