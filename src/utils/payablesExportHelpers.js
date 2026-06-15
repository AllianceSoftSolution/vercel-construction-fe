export const PO_EXPORT_COLUMNS = [
  { headerName: "No.", field: "no" },
  { headerName: "PO Reference", field: "poReference" },
  { headerName: "Project", field: "project" },
  { headerName: "Material", field: "material" },
  { headerName: "Vendor", field: "vendor" },
  { headerName: "Section", field: "section" },
  { headerName: "Qty", field: "quantity" },
  { headerName: "Unit", field: "unit" },
  { headerName: "Unit Price", field: "unitPrice" },
  { headerName: "Amount (PKR)", field: "amount" },
  { headerName: "Status", field: "status" },
];

export const VENDOR_PO_EXPORT_COLUMNS = [
  { headerName: "PO Reference", field: "poReference" },
  { headerName: "Material", field: "material" },
  { headerName: "Section", field: "section" },
  { headerName: "Qty", field: "quantity" },
  { headerName: "Unit", field: "unit" },
  { headerName: "Unit Price", field: "unitPrice" },
  { headerName: "Amount (PKR)", field: "amount" },
  { headerName: "Status", field: "status" },
  {
    headerName: "Proof of Bill",
    field: "proofOfBill",
    getExportValue: (row) => row.proofOfBill || "-",
  },
];

export const PAYMENT_EXPORT_COLUMNS = [
  { headerName: "Date", field: "date" },
  { headerName: "Amount (PKR)", field: "amount" },
  { headerName: "Note", field: "note" },
  {
    headerName: "Proof",
    field: "proofOfPayment",
    getExportValue: (row) => (row.proofOfPayment ? "View Proof" : "-"),
  },
];
