import { useState } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../comments/components/DropdownButton";
import {
  downloadPurchaseOrderPdf,
  purchaseOrderPdfMenuItems,
  viewPurchaseOrderPdf,
} from "../utils/downloadPurchaseOrderPdf";

export const POPdfActionCell = ({ value, row, extraItems = [] }) => {
  const poId = value || row?.id;
  if (!poId) return null;
  return (
    <DropdownButton
      items={[
        ...purchaseOrderPdfMenuItems(
          poId,
          row?.referenceNumber || row?.poReference
        ),
        ...extraItems,
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );
};

export const POPdfButtons = ({ poId, referenceNumber, className = "" }) => {
  const [viewing, setViewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  if (!poId) return null;

  const handleView = async () => {
    if (viewing) return;
    setViewing(true);
    try {
      await viewPurchaseOrderPdf(poId);
    } finally {
      setViewing(false);
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadPurchaseOrderPdf(poId, referenceNumber);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleView}
        disabled={viewing}
        className="px-4 py-2 rounded-lg border border-[#0252AD] text-[#0252AD] text-sm font-semibold hover:bg-[#0252AD] hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {viewing && <CircularProgress size={14} color="inherit" />}
        {viewing ? "Opening…" : "View PDF"}
      </button>
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="px-4 py-2 rounded-lg bg-[#F97316] text-white text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {downloading && <CircularProgress size={14} color="inherit" />}
        {downloading ? "Downloading…" : "Download PDF"}
      </button>
    </div>
  );
};

export default POPdfActionCell;
