import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PdfWithTable = () => {
  const generatePdf = () => {
    const doc = new jsPDF();

    // Add title or any header content
    doc.text("Generated PDF with Data Table", 20, 10);

    // Define the table columns and rows
    const columns = ["ID", "Name", "Email", "Country"];
    const rows = [
      [1, "John Doe", "john@example.com", "USA"],
      [2, "Jane Smith", "jane@example.com", "Canada"],
      [3, "Alice Brown", "alice@example.com", "UK"],
      [4, "Bob Johnson", "bob@example.com", "Germany"],
    ];

    // Use autoTable to add the table
    doc.autoTable({
      head: [columns], // Table header
      body: rows, // Table body
      startY: 20, // Starting Y position of the table
      theme: "grid", // Table theme (can be 'grid', 'plain', or 'striped')
      styles: {
        fontSize: 10, // Font size
      },
      headStyles: {
        fillColor: [100, 100, 255], // Blue header background
      },
    });

    // Save the PDF
    doc.save("table.pdf");
  };

  return (
    <div>
      <button onClick={generatePdf}>Download PDF</button>
    </div>
  );
};

export default PdfWithTable;
