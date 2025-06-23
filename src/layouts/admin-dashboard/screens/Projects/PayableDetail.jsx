import React from "react";
import TopBar from "@/components/ui/TopBar";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";

const mockData = [
  {
    id: 1,
    poRef: "PO-1001",
    material: "Cement",
    qty: "100 Bags",
    type: "Stock In",
    handledBy: "John Doe",
    remarks: "Received at site",
    date: "2025-06-21",
    fileUrl: "/docs/invoice-po1001.pdf",
  },
  {
    id: 2,
    poRef: "PO-1002",
    material: "Steel",
    qty: "50 Tons",
    type: "Stock Out",
    handledBy: "Ahmed Khan",
    remarks: "Issued for Block A",
    date: "2025-06-19",
    fileUrl: "/docs/dispatch-note-po1002.pdf",
  },
];

export default function PayableDetails() {
  return (
    <Box  py={6}>
      <TopBar
        title="Transaction History Detail"
        detail="Detailed view of material stock movement transactions for selected Purchase Order."
      />

      <TableContainer component={Paper} sx={{ mt: 6, borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>PO Ref</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Handled By</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Attachment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.poRef}</TableCell>
                <TableCell>{row.material}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.handledBy}</TableCell>
                <TableCell>{row.remarks}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <IconButton
                    component="a"
                    href={row.fileUrl}
                    download
                    size="small"
                    sx={{ color: "#1976d2" }}
                  >
                    <CloudDownload />
                    <Typography ml={1} fontSize="0.875rem">
                      Download
                    </Typography>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
