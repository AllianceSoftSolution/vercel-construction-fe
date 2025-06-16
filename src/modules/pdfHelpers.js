import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (data, keysAndHeaders, fileName) => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Map the keysAndHeaders to column headers and data keys
    const columns = Object.values(keysAndHeaders).map(header => ({ header }));
    const rows = data.map(item => {
        const row = {};
        for (const [key, header] of Object.entries(keysAndHeaders)) {
            // Get nested values if needed (e.g., customer.name)
            const value = key.split('.').reduce((acc, part) => acc && acc[part], item);
            row[header] = value !== undefined ? value : '';
        }
        return row;
    });

    // Use autoTable to create the table in the PDF
    doc.autoTable({
        head: [columns.map(col => col.header)],
        body: rows.map(row => columns.map(col => row[col.header])),
        startY: 20, // starting Y position for the table
    });

    // Add a title
    doc.text('Order Data', 14, 16);

    // Save the PDF
    doc.save(`${fileName}.pdf`);
};

export {generatePDF}



