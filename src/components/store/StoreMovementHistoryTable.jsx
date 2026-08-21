import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Modal } from "@mui/material";
import SimpleTable from "../SimpleTable";
import CustomTextField from "../../mui/CustomTextField";
import Button from "../Button";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import {
  buildAcceptedData,
  buildAcceptedSet,
  buildTransactionRow,
  buildViewedSet,
  markTransactionAccepted,
  markTransactionViewed,
  setAcceptedTransactionData,
  shouldShowActionColumn,
} from "../../utils/storeTransactionHelpers";
import FileUploadField from "../ui/FileUploadField";
import AttachmentLinks from "../ui/AttachmentLinks";
import useS3MultiUpload from "../../hooks/useS3MultiUpload";
import { UPLOAD_FOLDERS } from "../../constants/fileUpload";
import { normalizeAttachmentUrls } from "../../utils/fileUpload";

const FlowCell = ({ value }) => {
  if (!value || value === "—") return <span>—</span>;

  const transferMatch = String(value).match(/^FROM (.+) TO (.+)$/);
  if (transferMatch) {
    return (
      <span>
        <span className="font-bold">FROM</span> {transferMatch[1]}{" "}
        <span className="font-bold">TO</span> {transferMatch[2]}
      </span>
    );
  }

  const poMatch = String(value).match(/^FROM PO (.+)$/);
  if (poMatch) {
    return (
      <span>
        <span className="font-bold">FROM PO</span> {poMatch[1]}
      </span>
    );
  }

  return <span>{value}</span>;
};

const ViewDocumentCell = ({ value }) => {
  const urls = normalizeAttachmentUrls(value);
  if (!urls.length) return <span className="text-gray-400 text-sm">—</span>;
  return (
    <div className="flex flex-col gap-1">
      {urls.map((url, index) => (
        <button
          key={`${url}-${index}`}
          type="button"
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          className="bg-[#BF1017] hover:bg-[#a00e14] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap"
        >
          View Document{urls.length > 1 ? ` ${index + 1}` : ""}
        </button>
      ))}
    </div>
  );
};

const ReceivingNotesCell = ({ value }) => (
  <span className="text-sm text-gray-800">{value || "—"}</span>
);

const ReceivedDocumentsCell = ({ row }) => {
  const receivedDocs = row.receivedDocuments || [];
  if (!receivedDocs.length) return <span className="text-gray-400 text-sm">—</span>;
  return (
    <div className="flex flex-col gap-2">
      {receivedDocs.map((doc, index) => (
        <button
          key={index}
          type="button"
          onClick={() => window.open(doc.url, "_blank", "noopener,noreferrer")}
          className="bg-[#0074bd] hover:bg-[#005ea0] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap"
        >
          {doc.label || `Receiving Document ${index + 1}`}
        </button>
      ))}
    </div>
  );
};

const StoreMovementHistoryTable = ({
  storeData,
  storeId,
  sectionStoreTxns = [],
  recordsPerPage,
  onRefresh,
}) => {
  const [viewedSet, setViewedSet] = useState(() => buildViewedSet());
  const [acceptedSet, setAcceptedSet] = useState(() => buildAcceptedSet());
  const [acceptedTransactions, setAcceptedTransactions] = useState(() =>
    buildAcceptedData()
  );
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [acceptTransaction, setAcceptTransaction] = useState(null);
  const [acceptForm, setAcceptForm] = useState({ note: "", documentFiles: [] });
  const [acceptLoading, setAcceptLoading] = useState(false);
  const { uploadFiles, uploading: fileUploading } = useS3MultiUpload();

  const isHeadStore = storeData?.type === "HEAD_STORE";

  const transactionRowOptions = useMemo(
    () => ({
      acceptedTransactions,
      acceptedSet,
      viewedSet,
    }),
    [acceptedTransactions, acceptedSet, viewedSet]
  );

  const tableData = useMemo(() => {
    if (!storeData) return [];

    const inventory = (storeData.inventory || []).filter(
      (item) => item && typeof item === "object" && item.materialId
    );

    const ownRows = (storeData.transactions || [])
      .filter((item) => item && typeof item === "object" && item.id)
      .map((item) =>
        buildTransactionRow(item, storeData, {
          ...transactionRowOptions,
          inventory,
          extra: isHeadStore ? { _storeName: storeData.name || "Head Store" } : {},
        })
      );

    if (!isHeadStore) return ownRows;

    const sectionRows = sectionStoreTxns.map((entry) =>
      buildTransactionRow(entry.transaction, entry.store, {
        ...transactionRowOptions,
        inventory: entry.inventory || [],
        extra: { _storeName: entry.storeName },
      })
    );

    return [...ownRows, ...sectionRows].sort(
      (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
    );
  }, [storeData, sectionStoreTxns, isHeadStore, transactionRowOptions]);

  const showActionColumn = useMemo(
    () => shouldShowActionColumn(tableData),
    [tableData]
  );

  const columns = useMemo(() => {
    const base = [
      ...(isHeadStore ? [{ headerName: "Store", field: "_storeName" }] : []),
      { headerName: "Material", field: "materialName" },
      { headerName: "Type", field: "type" },
      { headerName: "Quantity", field: "quantity" },
      { headerName: "Flow", field: "flowStore" },
      { headerName: "Reference", field: "reference" },
      { headerName: "Notes", field: "notes" },
      { headerName: "Date", field: "transactionDateFormatted" },
      { headerName: "Document", field: "documentUrl" },
      { headerName: "Receiving Notes", field: "receivingNotes" },
      { headerName: "Receiving Documents", field: "receivedDocuments" },
    ];

    if (showActionColumn) {
      base.push({ headerName: "Action", field: "action" });
      base.push({ headerName: "", field: "isNew" });
    }

    return base;
  }, [isHeadStore, showActionColumn]);

  const markViewed = useCallback((transactionId) => {
    markTransactionViewed(transactionId);
    setViewedSet((prev) => new Set([...prev, transactionId]));
  }, []);

  const handleOpenAcceptModal = useCallback(
    (transaction) => {
      setAcceptTransaction(transaction);
      setAcceptForm({ note: transaction.notes || "", documentFiles: [] });
      setAcceptModalOpen(true);
      markViewed(transaction.id);
    },
    [markViewed]
  );

  const handleConfirmAccept = async () => {
    if (!acceptTransaction) return;
    if (!acceptForm.documentFiles.length) {
      toast.error("Attachment is required");
      return;
    }
    setAcceptLoading(true);

    try {
      const payload = {
        ...(acceptForm.note ? { note: acceptForm.note } : {}),
        documentUrls: await uploadFiles(
          acceptForm.documentFiles,
          UPLOAD_FOLDERS.document
        ),
      };

      const acceptStoreId = acceptTransaction.storeId || storeId;
      const res = await apiClient.post(
        `/stores/${acceptStoreId}/transactions/${acceptTransaction.id}/accept`,
        payload
      );

      if (!res.ok) {
        throw new Error(res.data?.message || "Failed to accept incoming request");
      }

      const acceptedDocumentUrls = normalizeAttachmentUrls(
        res.data?.transaction?.documentUrl
      );
      const fileDocs = acceptedDocumentUrls.map((url, index) => ({
        url,
        label: `Receiving Document ${index + 1}`,
        name: acceptForm.documentFiles[index]?.name || `Receiving Document ${index + 1}`,
      }));

      markTransactionAccepted(acceptTransaction.id);
      setAcceptedSet((prev) => new Set([...prev, acceptTransaction.id]));
      setAcceptedTransactions((prev) => {
        const next = {
          ...prev,
          [acceptTransaction.id]: {
            notes: acceptForm.note || "",
            documentUrls: fileDocs,
            acceptedAt: res.data?.transaction?.acceptedAt || new Date().toISOString(),
          },
        };
        setAcceptedTransactionData(next);
        return next;
      });

      toast.success("Incoming request accepted successfully.");
      setAcceptModalOpen(false);
      onRefresh?.();
    } catch (error) {
      toast.error(error.message || "Failed to accept incoming request");
    } finally {
      setAcceptLoading(false);
    }
  };

  const NewBadgeCell = useCallback(
    ({ value, row }) => {
      if (!value) return null;
      return (
        <button
          type="button"
          onClick={() => markViewed(row.id)}
          className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse cursor-pointer hover:bg-red-600 border-0"
          title="Click to mark as seen"
        >
          NEW
        </button>
      );
    },
    [markViewed]
  );

  const ActionCell = useCallback(
    ({ row }) => {
      if (row?.isAccepted) {
        return (
          <span className="text-green-700 text-xs font-semibold">Accepted</span>
        );
      }
      if (!row?.needsAccept) return null;
      return (
        <button
          type="button"
          onClick={() => handleOpenAcceptModal(row)}
          className="bg-[#0074bd] hover:bg-[#005ea0] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
        >
          Accept
        </button>
      );
    },
    [handleOpenAcceptModal]
  );

  return (
    <>
      <SimpleTable
              tableTitle="store-movement-history"
        data={tableData}
        columns={columns}
        cellComponents={{
          flowStore: FlowCell,
          documentUrl: ViewDocumentCell,
          receivingNotes: ReceivingNotesCell,
          receivedDocuments: ReceivedDocumentsCell,
          isNew: NewBadgeCell,
          action: ActionCell,
        }}
        recordsPerPage={recordsPerPage}
      />

      <Modal open={acceptModalOpen} onClose={() => setAcceptModalOpen(false)}>
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
          }}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#222222]">
              Incoming Transfer Request
            </h1>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Material</label>
                <div className="mt-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900">
                  {acceptTransaction?.materialName || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <div className="mt-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900">
                  {acceptTransaction?.quantity ?? "-"}
                </div>
              </div>
              <CustomTextField
                fullWidth
                margin="normal"
                label="Note"
                value={acceptForm.note}
                onChange={(e) =>
                  setAcceptForm((prev) => ({ ...prev, note: e.target.value }))
                }
              />
              <FileUploadField
                label="Attachment"
                required
                files={acceptForm.documentFiles}
                onChange={(documentFiles) =>
                  setAcceptForm((prev) => ({ ...prev, documentFiles }))
                }
                disabled={acceptLoading || fileUploading}
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAcceptModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <Button
                buttonText={acceptLoading ? "Accepting..." : "Accept"}
                onClick={handleConfirmAccept}
                disabled={acceptLoading || fileUploading}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default StoreMovementHistoryTable;
