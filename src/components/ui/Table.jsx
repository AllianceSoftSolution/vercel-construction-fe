import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import editIcon from "../../assets/dietapp/edit-icon.png";
import deleteIcon from "../../assets/dietapp/delete-icon.png";

// Helper function to create data rows
function createData(Id, UserName, Email, PhoneNumber, DietPlan, PackageLimit) {
  return { Id, UserName, Email, PhoneNumber, DietPlan, PackageLimit };
}

// Initial data rows
const initialRows = [
  createData(
    9090,
    "John Doe",
    "john@gmail.com",
    "1234567890",
    "Slimming Plan",
    "2 Weeks"
  ),
  createData(
    9091,
    "Jane Smith",
    "jane@gmail.com",
    "0987654321",
    "Bulking Plan",
    "1 Month"
  ),
  createData(
    9092,
    "Mike Tyson",
    "mike@gmail.com",
    "5555555555",
    "Maintenance",
    "3 Months"
  ),
];

export default function EditableTable() {
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [editingRow, setEditingRow] = React.useState(null);

  // Open the edit dialog
  const handleEdit = (row) => {
    setEditingRow({ ...row });
    setOpen(true);
  };

  // Delete a row by Id
  const handleDelete = (id) => {
    setRows((prev) => prev.filter((row) => row.Id !== id));
  };

  // Save the edited row
  const handleSave = () => {
    setRows((prev) =>
      prev.map((row) => (row.Id === editingRow.Id ? editingRow : row))
    );
    setOpen(false);
  };

  // Handle input changes in the edit dialog
  const handleChange = (field, value) => {
    setEditingRow((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Table sx={{ minWidth: 650 }} aria-label="editable table">
        <TableHead>
          <TableRow sx={{ borderBottom: "2px solid #ddd" }}>
            <TableCell>ID</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Diet Plan</TableCell>
            <TableCell>Package Limit</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.Id}
              sx={{
                borderBottom: "1px solid #ccc",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell>{row.Id}</TableCell>
              <TableCell>{row.UserName}</TableCell>
              <TableCell>{row.Email}</TableCell>
              <TableCell>{row.PhoneNumber}</TableCell>
              <TableCell>{row.DietPlan}</TableCell>
              <TableCell>{row.PackageLimit}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleEdit(row)}>
                  <img src={editIcon} alt="edit" width={20} />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.Id)}>
                  <img src={deleteIcon} alt="delete" width={20} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          {["UserName", "Email", "PhoneNumber", "DietPlan", "PackageLimit"].map(
            (field) => (
              <TextField
                key={field}
                label={field.replace(/([A-Z])/g, " $1").trim()}
                value={editingRow ? editingRow[field] : ""}
                onChange={(e) => handleChange(field, e.target.value)}
                fullWidth
                margin="dense"
              />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
