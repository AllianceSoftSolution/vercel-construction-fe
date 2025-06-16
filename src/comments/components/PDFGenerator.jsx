import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

const PDFGenerator = ({ pages, header, footer }) => {
  const pagesRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const pageStyle = {
    width: "100%", // PDF page width
    height: "1080px", // Initially set height to 100%
    marginBottom: "20px",
    borderRadius: "8px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };
  useEffect(() => {}, []);
  const generatePDF = async () => {
    setIsDownloading(true); // Show loading state
    const pdfTextElements = document.querySelectorAll(".custom-pdf-text");
    pdfTextElements.forEach((element) => {
      element.style.setProperty("transform", "translateY(-8px)", "important");
    });
    const icons = document.querySelectorAll(".custom-list-item-icon");
    icons.forEach((icon) => {
      icon.style.marginTop = "16px"; // Apply the marginTop style
    });
    // console.log("we are dom elemnts", pdfTextElements);
    // Temporarily change the height to 1920px for PDF generation
    const pagesElement = pagesRef.current;

    pagesElement.style.width = "1422px";
    // pagesElement.style.width = "1920px";

    // pagesElement.style.overflowX = "hidden";

    // //////////////////////////////////////////////////////

    const pageWidth = pagesElement.offsetWidth; ///1422
    const pageHeight = pagesElement.offsetHeight;

    console.log("i am pdf page widt height:==>", pageWidth, pageHeight);

    // Call the function on load and resize
    // adjustScale();
    setTimeout(async () => {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1080, 1422],
        // format: [1080, 1920], // PDF format size
      });

      const pageElements = pagesElement.querySelectorAll(".page");

      for (let i = 0; i < pageElements.length; i++) {
        const page = pageElements[i];
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          width: 1422,
          height: 1080,
          // width: 1920,
          // height: 1080,
        });

        const imgData = canvas.toDataURL("image/jpeg");
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save("Financial_Report.pdf");

      // Reset height back to 100%
      pdfTextElements.forEach((element) => {
        element.style.setProperty(
          "transform",
          "translateY(-10px)",
          "important"
        );
      });
      pagesElement.style.width = "100%";
      // adjustScale();

      setIsDownloading(false); // Hide loading state
      toast.success("PDF downloaded successfully!");
    }, 2000); // Brief delay to ensure height is adjusted before rendering
  };

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        disabled={isDownloading}
      >
        {isDownloading ? "Generating PDF..." : "Download PDF Report"}
      </Button>

      {isDownloading && (
        <div
        // style={backdropStyle}
        >
          <div style={loadingMessageStyle}>Generating PDF, please wait...</div>
        </div>
      )}

      <div ref={pagesRef} style={{ marginTop: "20px" }}>
        {pages.map((pageContent, index) => (
          <div className="page" key={index} style={pageStyle}>
            {header && <div style={headerStyle}>{header}</div>}
            {pageContent}
            {footer && <div style={footerStyle}>{footer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Style for the header and footer
const headerStyle = {
  width: "100%",
  textAlign: "center",
  marginBottom: "20px",
  borderBottom: "1px solid #ccc",
  paddingBottom: "10px",
};

const footerStyle = {
  width: "100%",
  textAlign: "center",
  marginTop: "20px",
  borderTop: "1px solid #ccc",
  paddingTop: "10px",
};

// Style for the backdrop
const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(20px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  pointerEvents: "none",
};

// Style for the loading message
const loadingMessageStyle = {
  color: "#fff",
  fontSize: "24px",
  fontWeight: "bold",
};

export default PDFGenerator;

// import React, { useRef, useState } from "react";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import { Button } from "@mui/material";
// import toast, { Toaster } from "react-hot-toast";

// const PDFGenerator = ({ pages, header, footer }) => {
//   const pagesRef = useRef(null);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const pageStyle = {
//     // width: "841.89px",
//     width: "1920px", // PDF page width
//     height: "1080px", // PDF page height
//     // height: "595.28px",

//     marginBottom: "20px",
//     // border: "1px solid #ddd",
//     borderRadius: "8px",
//     boxSizing: "border-box",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     textAlign: "center",
//   };
//   const generatePDF = async () => {
//     setIsDownloading(true); // Set downloading state to true

//     const pdf = new jsPDF({
//       orientation: "landscape",
//       unit: "px",
//       format: [1080, 1520], // A4 size in landscape

//       // format: [595.28, 841.89], // A4 size in landscape
//     });

//     const pages = pagesRef.current.querySelectorAll(".page");

//     for (let i = 0; i < pages.length; i++) {
//       const page = pages[i];
//       const canvas = await html2canvas(page, {
//         scale: 2, // Adjust the scale for better quality
//         useCORS: true,
//         width: 1920, // Fixed width for PDF size
//         height: 1080, // Fixed height for PDF size
//       });

//       const imgData = canvas.toDataURL("image/jpeg");
//       const imgWidth = pdf.internal.pageSize.getWidth();
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       if (i > 0) pdf.addPage();

//       // Add the canvas image with adjusted positioning
//       pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight); // Set both X and Y to 0
//     }

//     pdf.save("Financial_Report.pdf");
//     setIsDownloading(false); // Reset downloading state after saving

//     // Show success toast notification
//     toast.success("PDF downloaded successfully!");
//   };

//   return (
//     <div style={{ position: "relative", padding: "20px" }}>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={generatePDF}
//         disabled={isDownloading}
//       >
//         {isDownloading ? "Generating PDF..." : "Download PDF Report"}
//       </Button>

//       {isDownloading && (
//         <div style={backdropStyle}>
//           <div style={loadingMessageStyle}>Generating PDF, please wait...</div>
//         </div>
//       )}

//       <div ref={pagesRef} style={{ marginTop: "20px" }}>
//         {pages.map((pageContent, index) => (
//           <div className="page" key={index} style={pageStyle}>
//             {header && <div style={headerStyle}>{header}</div>}
//             {pageContent}
//             {footer && <div style={footerStyle}>{footer}</div>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Style for the header and footer
// const headerStyle = {
//   width: "100%",
//   textAlign: "center",
//   marginBottom: "20px",
//   borderBottom: "1px solid #ccc",
//   paddingBottom: "10px",
// };

// const footerStyle = {
//   width: "100%",
//   textAlign: "center",
//   marginTop: "20px",
//   borderTop: "1px solid #ccc",
//   paddingTop: "10px",
// };

// // Style for the backdrop
// const backdropStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   backdropFilter: "blur(20px)", // Apply a blur effect
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
//   pointerEvents: "none", // Prevent clicks while downloading
// };

// // Style for the loading message
// const loadingMessageStyle = {
//   color: "#fff",
//   fontSize: "24px",
//   fontWeight: "bold",
// };

// export default PDFGenerator;
