import toast from "react-hot-toast";
import apiClient from "../api/apiClient";

const sanitizeFilename = (value) =>
  String(value || "purchase-order").replace(/[^\w.-]+/g, "_");

const fetchPurchaseOrderPdf = async (poId, download = false) => {
  const res = await apiClient.get(
    `/purchase-orders/${poId}/pdf${download ? "?download=1" : ""}`,
    {},
    { responseType: "blob" }
  );

  if (!res.ok) {
    let message = "Failed to generate purchase order PDF";
    if (res.data instanceof Blob) {
      try {
        const text = await res.data.text();
        const parsed = JSON.parse(text);
        message = parsed.message || message;
      } catch {
        /* keep default */
      }
    } else if (res.data?.message) {
      message = res.data.message;
    }
    throw new Error(message);
  }

  const blob =
    res.data instanceof Blob
      ? res.data
      : new Blob([res.data], { type: "application/pdf" });
  return { blob };
};

export const viewPurchaseOrderPdf = async (poId) => {
  const toastId = toast.loading("Generating PDF…");
  try {
    const { blob } = await fetchPurchaseOrderPdf(poId, false);
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      toast.error("Allow pop-ups to view the PDF, or use Download instead.", {
        id: toastId,
      });
    } else {
      toast.success("PDF ready", { id: toastId });
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    toast.error(error.message || "Could not open purchase order PDF", {
      id: toastId,
    });
  }
};

export const downloadPurchaseOrderPdf = async (poId, referenceNumber) => {
  const toastId = toast.loading("Preparing download…");
  try {
    const { blob } = await fetchPurchaseOrderPdf(poId, true);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeFilename(referenceNumber || poId)}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    toast.success("PDF downloaded", { id: toastId });
  } catch (error) {
    toast.error(error.message || "Could not download purchase order PDF", {
      id: toastId,
    });
  }
};

export const purchaseOrderPdfMenuItems = (poId, referenceNumber) => [
  {
    label: "View PDF",
    onClick: () => viewPurchaseOrderPdf(poId),
  },
  {
    label: "Download PDF",
    onClick: () => downloadPurchaseOrderPdf(poId, referenceNumber),
  },
];
