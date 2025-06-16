// import React, { useEffect, useRef, useState } from "react";
// import {
//   TextField,
//   Button,
//   FormControlLabel,
//   RadioGroup,
//   Radio,
//   Container,
//   Typography,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CardHeader,
//   CircularProgress,
// } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   Intro,
//   ImportantInfo,
//   ImportantInfo1,
//   TaxSavings,
//   StrategyOverview,
// } from "@/components/pdf/PdfPages";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import { styled } from "@mui/system";
// import apiClient from "@/api/apiClient";
// import { useLocation, useParams } from "react-router-dom";
// import { formatToK } from "@/modules/helpers";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import PDFGenerator from "@/components/PDFGenerator";
// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//   borderRadius: "8px",
// }));

// const StyledTableHead = styled(TableHead)(({ theme }) => ({
//   backgroundColor: "#1976d2", // Customize header background color
// }));

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   color: "white", // White text for the header
//   fontWeight: "bold",
//   padding: "16px 12px",
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: "#f5f5f5", // Light background for odd rows
//   },
//   "&:nth-of-type(even)": {
//     backgroundColor: "#ffffff", // White background for even rows
//   },
//   "&:hover": {
//     backgroundColor: "#e3f2fd", // Row hover effect
//   },
// }));

// const StyledBodyCell = styled(TableCell)(({ theme }) => ({
//   padding: "16px 12px", // Add padding for spacing
//   color: "#333", // Dark text for better readability
// }));

// const FutureValueCalculator = (props) => {
//   const location = useLocation();
//   const { tax_plan_id, client_id } = useParams();
//   const fullPageRef = useRef(); // Reference to the full page content
//   const [tabIndex, setTabIndex] = useState(0);

//   const user = useSelector((state) => state.auth?.user?._id);
//   // const client_id = user || user_id;
//   const params = new URLSearchParams(location.search);
//   const docmode = params.get("mode");
//   const isPDFMode = docmode === "pdf_gen";
//   const configStyles = {
//     default: {
//       container: "p-4 m-0 bg-white", // Default styles
//       header: "text-xl font-semibold",
//       box: "border-b-2 border-gray-200 mt-2",
//     },
//     pdf_gen: {
//       container: "p-8 m-4 bg-gray-100", // Styles for PDF generation
//       header: "text-2xl  font-bold text-center",
//       box: "border-b-4 border-black mt-4",
//       cutsom: "bg-[red]",
//     },
//   };

//   const modeStyles =
//     isPDFMode === "pdf_gen" ? configStyles.pdf_gen : configStyles.default;

//   const [loading, setloading] = useState(false);
//   const [assignedStrategies, setAssignedStrategies] = useState([]);
//   const [periods, setPeriod] = useState(10);
//   const [startingAmount, setStartingAmount] = useState(0);
//   const [stateTaxSavings, setstateTaxSavings] = useState(0);
//   const [interestRate, setInterestRate] = useState(7);
//   const [deposit, setDeposit] = useState(0);
//   const [compounding, setCompounding] = useState("beginning");
//   const [results, setResults] = useState(null);
//   const [noOfBusinessStrategies, setNoOfBusinessStrategies] = useState(0);
//   const [noOfIndividualStrategies, setNoOfIndvidualStrategies] = useState(0);
//   const [startegyList, setStartegyList] = useState([]);
//   const [btnPressed, setPressed] = useState(false);
//   const [BeforeAfterStrategies, setBeforeAfterStartegiesData] = useState([]);
//   const [clientName, setClientName] = useState("");
//   const [clientAge, setClientAge] = useState("");
//   const [riskLoading, setRiskLoading] = useState(true);
//   const [riskAssessmentStatus, setRiskAssessmentStatus] = useState(null);

//   const fetchTaxPlanData = async () => {
//     try {
//       const result = await apiClient.get(`tax-plan/${tax_plan_id}`);
//       if (!result.ok) throw new Error("Something went wrong");
//       setRiskAssessmentStatus(
//         result?.data?.data?.taxPlan?.assessmentCompletion
//       );
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setloading(false);
//     }
//   };

//   const fetchData = async () => {
//     setloading(true);
//     const result = await apiClient.get(`client/${client_id}`);
//     if (!result.ok) {
//       toast.error("Something went wrong");
//       setloading(false);
//       return;
//     }

//     // alert(JSON.stringify(result?.data?.client?.personalInfo,))
//     const clientsAge = result?.data?.client?.personalInfo?.age;
//     setClientAge(clientsAge);
//     setClientName(result?.data?.client?.personalInfo?.name);
//     setPeriod(67 - Number(clientsAge));
//     // setData(result.data.clients);
//     // setCount(result.data.count);

//     setloading(false);
//   };
//   const fetchStrategies = async () => {
//     setloading(true); // Set loading before the request
//     try {
//       const response = await apiClient.get(
//         `/tax-plan/${tax_plan_id}/strategies?page=${1}&fetchAll=true&search=`
//       );

//       if (
//         response?.data?.strategies &&
//         Array.isArray(response?.data?.strategies) &&
//         response?.data?.strategies?.length > 0
//       ) {
//         setAssignedStrategies(response?.data?.strategies);
//         const strats = response?.data?.strategies;

//         const businessCount = strats.filter(
//           (item) => item.associatedWith === "business"
//         ).length;

//         const individualCount = strats.filter(
//           (item) => item.associatedWith === "indvidual"
//         ).length;

//         setNoOfBusinessStrategies(businessCount);
//         setNoOfIndvidualStrategies(individualCount);
//         setStrategiesAggregatedDataForPieChart(getTaxSavingsArray(strats));
//         setStartegyList([...strats]);
//         // Update with the fetched data
//       } else if (response.status === 404) {
//         // <FvCalculator
//         //   data={[]}
//         //   period={67 - period}
//         //   startingAmount={startingAmount}
//         //   setStartingAmount={setStartingAmount}
//         // />;
//         console.log("message 22");
//         setAssignedStrategies([]); // If no data, empty the array
//       }
//     } catch (error) {
//       console.error("Error fetching strategies", error); // Handle error
//       setAssignedStrategies([]); // If no data, empty the array
//     } finally {
//       setloading(false); // Set loading to false after everything is done
//     }
//   };
//   const fetchBeforeAfterAsync = async () => {
//     try {
//       const beforeAfterData = await fetchBeforeAfterData(tax_plan_id);
//       setBeforeAfterStartegiesData(beforeAfterData);
//       console.log("Before and After Data:", beforeAfterData);
//     } catch (error) {
//       console.error("Error in fetch operations:", error);
//     }
//   };
//   useEffect(() => {
//     // console.log("Useeffect");
//     fetchData();
//     fetchStrategies();
//     fetchBeforeAfterAsync();
//     initializePdfGenrWithData();
//   }, []);

//   useEffect(() => {
//     if (assignedStrategies.length > 0) {
//       const totalFedTaxSavings = assignedStrategies.reduce(
//         (acc, strategy) => acc + strategy?.federalTaxSavings,
//         0
//       );
//       const totalStateTaxSavings = assignedStrategies.reduce(
//         (acc, strategy) => acc + strategy?.stateTaxSavings,
//         0
//       );
//       setstateTaxSavings(totalStateTaxSavings);
//       setStartingAmount(totalFedTaxSavings);
//       setDeposit(totalFedTaxSavings);
//       console.log("fvcalcl", totalFedTaxSavings);
//     }
//   }, [assignedStrategies]);

//   // 14B5F0  ,  434343   ,  DFCF6A  ,  3574E3

//   const COLORS = ["#14B5F0", "#434343", "#DFCF6A", "#3574E3"];
//   // const COLORS = ["#79B5F3", "#8884D8", "#FF7F7F"];

//   const CustomTooltip = ({ active, payload, riskAssessmentStatus }) => {
//     if (active && payload && payload.length) {
//       const { name, value, index } = payload[0]; // Include index in destructuring
//       const total = calculateTotal(strategiesAggregatedDataForPieChart);
//       const percent = ((value / total) * 100).toFixed(2); // Calculate percentage

//       // Determine the displayed name based on riskAssessmentStatus
//       const displayedName = riskAssessmentStatus
//         ? name
//         : `Strategy ${index + 1}`;

//       return (
//         <Box
//           sx={{
//             backgroundColor: "#ffffff",
//             border: "1px solid #e0e0e0",
//             borderRadius: 2,
//             padding: 1,
//             boxShadow: 2,
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="subtitle2" color="textSecondary">
//             {displayedName}
//           </Typography>
//           <Typography variant="h6" color="#333">
//             {`${value} (${percent}%)`}
//           </Typography>
//         </Box>
//       );
//     }
//     return null;
//   };

//   // const CustomTooltip = ({ active, payload }) => {
//   //   if (active && payload && payload.length) {
//   //     const { name, value } = payload[0];
//   //     const total = calculateTotal(strategiesAggregatedDataForPieChart);
//   //     const percent = ((value / total) * 100).toFixed(2); // Calculate percentage

//   //     return (
//   //       <Box
//   //         sx={{
//   //           backgroundColor: "#ffffff",
//   //           border: "1px solid #e0e0e0",
//   //           borderRadius: 2,
//   //           padding: 1,
//   //           boxShadow: 2,
//   //           textAlign: "center",
//   //         }}
//   //       >
//   //         <Typography variant="subtitle2" color="textSecondary">
//   //           {name}
//   //         </Typography>
//   //         <Typography variant="h6" color="#333">
//   //           {`${value} (${percent}%)`}
//   //         </Typography>
//   //       </Box>
//   //     );
//   //   }
//   //   return null;
//   // };

//   const calculateFutureValue = () => {
//     const data = [];
//     const rate = parseFloat(interestRate) / 100; // Annual rate in decimal
//     let totalDeposits = 0;
//     let totalInterest = 0;
//     const startBalance = parseFloat(startingAmount); // Constant starting amount

//     let balance = startBalance; // Initial balance

//     for (let i = 1; i <= periods; i++) {
//       // Add deposit at the beginning of the period
//       if (compounding === "beginning") {
//         balance += parseFloat(deposit);
//         totalDeposits += parseFloat(deposit);
//       }

//       // Calculate interest for the current period
//       const interest = balance * rate;
//       totalInterest += interest;

//       // Add interest to balance
//       balance += interest;

//       // Add deposit at the end of the period
//       if (compounding === "end") {
//         balance += parseFloat(deposit);
//         totalDeposits += parseFloat(deposit);
//       }

//       // Collect data for stacked chart
//       data.push({
//         period: i,
//         startBalance: startBalance, // Constant starting amount
//         deposit: compounding === "beginning" ? parseFloat(deposit) : 0,
//         interest: interest, // Interest earned for this period
//         endBalance: balance, // Ending balance for the period
//         totalDeposits: totalDeposits, // Cumulative deposits
//         totalInterest: totalInterest, // Cumulative interest
//       });
//     }

//     // Update results state
//     setResults({
//       futureValue: balance.toFixed(2),
//       totalDeposits: totalDeposits.toFixed(2),
//       totalInterest: totalInterest.toFixed(2),
//       chartData: data, // Data for the chart
//     });
//   };

//   const [
//     strategiesAggregatedDataForPieChart,
//     setStrategiesAggregatedDataForPieChart,
//   ] = useState([]);
//   const [dwnldBtnDisplay, setDwnldBtnDisplay] = useState(true);
//   const legendItems = strategiesAggregatedDataForPieChart.map(
//     (entry, index) => ({
//       name: entry.name,
//       color: COLORS[index % COLORS.length],
//     })
//   );
//   const [isOpen, setIsOpen] = useState(false);
//   const [introConfigData, setIntroConfigData] = useState({});
//   const [importantInfoConfigData, setImportantConfigData] = useState({});
//   const [importantInfo_1_Config, setImportantInfo_1_ConfigData] = useState({});
//   const [taxSavingsConfigData, setTaxSavingsConfigData] = useState({});
//   const [overviewConfigData, setOverviewConfigData] = useState({});
//   const handleOpen = () => setIsOpen(true);
//   const handleClose = () => setIsOpen(false);

//   const generatePDF = async () => {
//     setDwnldBtnDisplay(false); // Hide the button immediately

//     // Optional delay for UI update
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     if (fullPageRef.current) {
//       const pdf = new jsPDF({
//         orientation: "landscape", // Landscape mode
//       });

//       const page = fullPageRef.current;

//       // Capture the full page content
//       const canvas = await html2canvas(page, {
//         scale: 2, // Increase scale for better quality
//         useCORS: true, // Allow cross-origin images if applicable
//       });

//       const imgData = canvas.toDataURL("image/jpeg");
//       const imgWidth = pdf.internal.pageSize.getWidth(); // Use full width of the PDF page
//       const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

//       let heightLeft = imgHeight;
//       let position = 0;

//       // Define the bottom margin in mm (5px = 1.41mm)
//       const bottomMargin = 2.41; // 5px converted to mm

//       // Add the first page
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, "FAST");
//       heightLeft -= pdf.internal.pageSize.getHeight() - bottomMargin; // Adjust height left for bottom margin

//       // Add pages if content overflows
//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight; // Calculate position for the next page
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pdf.internal.pageSize.getHeight() - bottomMargin; // Adjust height left for bottom margin
//       }

//       // Save the PDF
//       pdf.save("full_page.pdf");

//       // Optional: Reset button display after saving, if needed
//       // setDwnldBtnDisplay(true); // Uncomment if you want to show the button again after download
//     }
//   };

//   const initializePdfGenrWithData = () => {
//     if (results && !loading) {
//       setIntroConfigData({
//         imageSrc: "/intro-pdf.png",
//         mainTitle: "Tax Planning Report",
//         subtitle: "Tax Year 2024",
//         additionalInfo: clientName || "",
//         presenterName: "Norman Dotch",
//         presenterRole: "Tax Planner & Registered Investment Adviser (RIA)",
//         footerText:
//           "This Presentation is for informational purposes only and intended for the designated recipient. Vera Tributum disclaims liability for decisions or actions taken based on this Presentation, which should not be construed as legal or tax advice. Unauthorized reproduction, redistribution, or reliance on this material is prohibited.",
//         logoSrc: "/logo-3percenttaxold 1.png",
//         riskAssessmentStatus: riskAssessmentStatus,
//       });
//       setImportantConfigData({
//         imageSrc: "/intro-pdf.png",
//         logoSrc: "/logo-3percenttaxold 1.png",
//         title: "Financial Report",
//         subtitle: "Presented by Norman Dotch",
//         disclaimerItems: [
//           `This Presentation, including all associated materials (collectively "this Presentation") is for informational purposes and its use is for the intended recipient only. Nothing in this Presentation should be construed to constitute or be relied upon as providing a legal opinion or providing legal advice by Dotch Capital. No accountant-client relationship is created solely by your use of this Presentation. Dotch Capital, its licensors and suppliers disclaim all liability in connection with your use of this presentation and you assume all responsibilities and obligations with respect to any decisions, conclusions, opinions or actions that you may take regarding your use of this Presentation.`,
//           `Any reproduction, copying or redistribution of this Presentation, electronic or otherwise, in whole or in part, is strictly prohibited without the express written permission of Dotch Capital.`,
//           `Any tax-related information provided by this Presentation should not be used or be relied upon to (i) avoid the imposition of any payment, interest, or penalties imposed by the U.S. Internal Revenue Service or to otherwise (ii) promote, market or recommend to others any tax-related advice.`,
//           `This Presentation utilizes sections of the Internal Revenue Code and associated regulations in effect as of the date of this Presentation. Dotch Capital assumes no obligation to update this Presentation in order to reflect changes in the U.S. tax laws.`,
//           `This Presentation also utilizes certain information that you may have provided to Dotch Capital such as certain prior tax returns and answers to certain tax-related questionnaires. Neither Dotch Capital, its suppliers, nor licensors shall be held liable for any liabilities arising from any incomplete, inaccurate, missing, or other erroneous information provided to Dotch Capital or for any errors or omissions of Dotch Capital, its suppliers, and licensors with respect to the use of this Presentation. You further acknowledge that your use of this Presentation does not make you a third-party beneficiary with respect to any products or services provided, supplied, and/or licensed to Dotch Capital.`,
//         ],
//         riskAssessmentStatus: riskAssessmentStatus,
//       });
//       setImportantInfo_1_ConfigData({
//         imageSrc: "/intro-pdf.png",
//         logoSrc: "/logo-3percenttaxold 1.png",
//         title: "Financial Report",
//         subtitle: "Presented by Norman Dotch",
//         currentAge: clientAge || "",
//         detailsData: [
//           {
//             label: "AGE TO RETIRE",
//             value: "65 y/o",
//             description:
//               "If you were born in 1960 or later, 67 years old is the age in which you can retire with full benefits.",
//           },
//           {
//             label: "CURRENT SAVINGS",
//             value: "$" + (startingAmount + stateTaxSavings),
//             description:
//               "This should be the total of all your retirement accounts including 401(k)s, IRAs, 403(b)s, etc.",
//           },
//           {
//             label: "PLANNED MONTHLY CONTRIBUTION",
//             value: "$" + startingAmount / 12,
//             description:
//               "This is the amount you plan to contribute to your retirement savings each month.",
//           },
//           {
//             label: "TAX SAVINGS MONTHLY CONTRIBUTION",
//             value: "$" + startingAmount / 12,
//             description:
//               "This is the additional amount you can add to your retirement savings each month based on the total savings in this plan.",
//           },
//           {
//             label: "ANNUAL RETURN",
//             value: "10.00%",
//             description:
//               "This is the return your investment will generate over time.",
//           },
//         ],
//         initialBalance: "$" + startingAmount, // Add initial balance if applicable
//         contributions: results?.totalDeposits, // Add contributions if applicable
//         growth: results?.totalInterest, // Add growth if applicable
//         investmentWorth: "$" + results?.futureValue,
//         disclaimer: {
//           disc1: `
//     The figures provided herein are estimates and projections based on information provided by the
//     potential Client and/or Client. The “3% Tax Truths” Tax Planning Software is not responsible
//     for the Client’s financial position, business outcomes or legal structures. Because federal
//     and state laws, statutes, rules, and regulations are subject to change at any time,
//     specific results are not guaranteed.`,

//           disc2: `
//     Client understands and agrees that any proposed benefits of the “3% Tax Truths” Tax Planning
//     Software require that the Client completely and consistently implement any and all
//     recommendations of the “3% Tax Truths” Tax Planning Software. Client further agrees that
//     failure to completely and consistently implement any and all such recommendations is no
//     fault of the “3% Tax Truths” Tax Planning Software. Client acknowledges, understands, and
//     agrees that implementation of any recommendations by any third party that is not the “3%
//     Tax Truths” Tax Planning Software shall not be the responsibility of the “3% Tax Truths”
//     Tax Planning Software, and Client agrees to undertake and accept any and all risks and
//     consequences, financial or otherwise, of the implementation of the Consulting Services by
//     anyone other than the 3% Tax Truths Tax Planning Software.`,
//           disc3: `
//     **Savings is not net of cost and fees associated with planning.**`,
//         },
//         barChartData: results?.chartData,
//         riskAssessmentStatus: riskAssessmentStatus,
//       });
//       setTaxSavingsConfigData({
//         strategiesAggregatedDataForPieChart:
//           strategiesAggregatedDataForPieChart,
//         renderCustomLabel: renderCustomLabel,
//         COLORS: COLORS,
//         CustomTooltip: CustomTooltip,
//         CustomLegendPieChart: CustomLegendPieChart,
//         legendItems: legendItems,
//         strategiestableData: [
//           { label: "Taxable Income", before: 231, after: -108 },
//           { label: "Tax to Pay", before: 138.6, after: -64.8 },
//           // Additional rows can be added here
//         ],
//         taxPlanCardsData: [
//           { title: "Federal Tax Saving", value: 153 },
//           { title: "State Tax Savings", value: 186 },
//           { title: "No. of Strategies (Business)", value: 3 },
//           { title: "No. of Strategies (Individual)", value: 5 },
//           // Additional cards can be added here
//         ],
//         riskAssessmentStatus: riskAssessmentStatus,
//       });
//       const fmd = async () => {
//         const fmdVar = await formatStrategiesTableData(startegyList);
//         await setOverviewConfigData({
//           imageSrc: "/intro-pdf.png", // Use the same image source as needed
//           logoSrc: "/logo-3percenttaxold 1.png", // Same logo source as needed
//           title: "Tax Planning Report", // Change title as needed
//           subtitle: "Presented by Norman Dotch", // Change presenter name as needed

//           strategiesTableData: fmdVar,
//           riskAssessmentStatus: riskAssessmentStatus,
//         });
//       };
//       fmd();
//     }
//   };

//   //   const initializePdfGenrWithData = () => {
//   //     if (results && !loading) {
//   //       setIntroConfigData({
//   //         imageSrc: "/intro-pdf.png",
//   //         mainTitle: "Tax Planning Report",
//   //         subtitle: "Tax Year 2024",
//   //         additionalInfo: clientName || "",
//   //         presenterName: "Norman Dotch",
//   //         presenterRole: "Tax Planner & Registered Investment Adviser (RIA)",
//   //         footerText:
//   //           "This Presentation is for informational purposes only and intended for the designated recipient. Vera Tributum disclaims liability for decisions or actions taken based on this Presentation, which should not be construed as legal or tax advice. Unauthorized reproduction, redistribution, or reliance on this material is prohibited.",
//   //         logoSrc: "/logo-3percenttax.png",
//   //         riskAssessmentStatus: riskAssessmentStatus,
//   //       });
//   //       setImportantConfigData({
//   //         imageSrc: "/intro-pdf.png",
//   //         logoSrc: "/logo-3percenttax.png",
//   //         title: "Financial Report",
//   //         subtitle: "Presented by Norman Dotch",
//   //         disclaimerItems: [
//   //           `This Presentation, including all associated materials (collectively "this Presentation") is for informational purposes and its use is for the intended recipient only. Nothing in this Presentation should be construed to constitute or be relied upon as providing a legal opinion or providing legal advice by Dotch Capital. No accountant-client relationship is created solely by your use of this Presentation. Dotch Capital, its licensors and suppliers disclaim all liability in connection with your use of this presentation and you assume all responsibilities and obligations with respect to any decisions, conclusions, opinions or actions that you may take regarding your use of this Presentation.`,
//   //           `Any reproduction, copying or redistribution of this Presentation, electronic or otherwise, in whole or in part, is strictly prohibited without the express written permission of Dotch Capital.`,
//   //           `Any tax-related information provided by this Presentation should not be used or be relied upon to (i) avoid the imposition of any payment, interest, or penalties imposed by the U.S. Internal Revenue Service or to otherwise (ii) promote, market or recommend to others any tax-related advice.`,
//   //           `This Presentation utilizes sections of the Internal Revenue Code and associated regulations in effect as of the date of this Presentation. Dotch Capital assumes no obligation to update this Presentation in order to reflect changes in the U.S. tax laws.`,
//   //           `This Presentation also utilizes certain information that you may have provided to Dotch Capital such as certain prior tax returns and answers to certain tax-related questionnaires. Neither Dotch Capital, its suppliers, nor licensors shall be held liable for any liabilities arising from any incomplete, inaccurate, missing, or other erroneous information provided to Dotch Capital or for any errors or omissions of Dotch Capital, its suppliers, and licensors with respect to the use of this Presentation. You further acknowledge that your use of this Presentation does not make you a third-party beneficiary with respect to any products or services provided, supplied, and/or licensed to Dotch Capital.`,
//   //         ],
//   //         riskAssessmentStatus: riskAssessmentStatus,
//   //       });
//   //       setImportantInfo_1_ConfigData({
//   //         imageSrc: "/intro-pdf.png",
//   //         logoSrc: "/logo-3percenttax.png",
//   //         title: "Financial Report",
//   //         subtitle: "Presented by Norman Dotch",
//   //         currentAge: clientAge || "",
//   //         detailsData: [
//   //           {
//   //             label: "AGE TO RETIRE",
//   //             value: "65 y/o",
//   //             description:
//   //               "If you were born in 1960 or later, 67 years old is the age in which you can retire with full benefits.",
//   //           },
//   //           {
//   //             label: "CURRENT SAVINGS",
//   //             value: "$" + (startingAmount + stateTaxSavings),
//   //             description:
//   //               "This should be the total of all your retirement accounts including 401(k)s, IRAs, 403(b)s, etc.",
//   //           },
//   //           {
//   //             label: "PLANNED MONTHLY CONTRIBUTION",
//   //             value: "$" + startingAmount / 12,
//   //             description:
//   //               "This is the amount you plan to contribute to your retirement savings each month.",
//   //           },
//   //           {
//   //             label: "TAX SAVINGS MONTHLY CONTRIBUTION",
//   //             value: "$" + startingAmount / 12,
//   //             description:
//   //               "This is the additional amount you can add to your retirement savings each month based on the total savings in this plan.",
//   //           },
//   //           {
//   //             label: "ANNUAL RETURN",
//   //             value: "10.00%",
//   //             description:
//   //               "This is the return your investment will generate over time.",
//   //           },
//   //         ],
//   //         initialBalance: "$" + startingAmount, // Add initial balance if applicable
//   //         contributions: results?.totalDeposits, // Add contributions if applicable
//   //         growth: results?.totalInterest, // Add growth if applicable
//   //         investmentWorth: "$" + results?.futureValue,
//   //     disclaimer:{
//   //   disc1: `
//   //     The figures provided herein are estimates and projections based on information provided by the
//   //     potential Client and/or Client. The “3% Tax Truths” Tax Planning Software is not responsible
//   //     for the Client’s financial position, business outcomes or legal structures. Because federal
//   //     and state laws, statutes, rules, and regulations are subject to change at any time,
//   //     specific results are not guaranteed.`,

//   //   disc2: `
//   //     Client understands and agrees that any proposed benefits of the “3% Tax Truths” Tax Planning
//   //     Software require that the Client completely and consistently implement any and all
//   //     recommendations of the “3% Tax Truths” Tax Planning Software. Client further agrees that
//   //     failure to completely and consistently implement any and all such recommendations is no
//   //     fault of the “3% Tax Truths” Tax Planning Software. Client acknowledges, understands, and
//   //     agrees that implementation of any recommendations by any third party that is not the “3%
//   //     Tax Truths” Tax Planning Software shall not be the responsibility of the “3% Tax Truths”
//   //     Tax Planning Software, and Client agrees to undertake and accept any and all risks and
//   //     consequences, financial or otherwise, of the implementation of the Consulting Services by
//   //     anyone other than the 3% Tax Truths Tax Planning Software.`,
//   //   disc3: `
//   //     **Savings is not net of cost and fees associated with planning.**`
//   // },
//   //         barChartData: results?.chartData,
//   //         riskAssessmentStatus: riskAssessmentStatus,
//   //       });
//   //       setTaxSavingsConfigData({
//   //         strategiesAggregatedDataForPieChart:
//   //           strategiesAggregatedDataForPieChart,
//   //         renderCustomLabel: renderCustomLabel,
//   //         COLORS: COLORS,
//   //         CustomTooltip: CustomTooltip,
//   //         CustomLegendPieChart: CustomLegendPieChart,
//   //         legendItems: legendItems,
//   //         strategiestableData: [
//   //           { label: "Taxable Income", before: 231, after: -108 },
//   //           { label: "Tax to Pay", before: 138.6, after: -64.8 },
//   //           // Additional rows can be added here
//   //         ],
//   //         taxPlanCardsData: [
//   //           { title: "Federal Tax Saving", value: 153 },
//   //           { title: "State Tax Savings", value: 186 },
//   //           { title: "No. of Strategies (Business)", value: 3 },
//   //           { title: "No. of Strategies (Individual)", value: 5 },
//   //           // Additional cards can be added here
//   //         ],
//   //         riskAssessmentStatus: riskAssessmentStatus,
//   //       });
//   //       const fmd = async () => {
//   //         const fmdVar = await formatStrategiesTableData(startegyList);
//   //         await setOverviewConfigData({
//   //           imageSrc: "/intro-pdf.png", // Use the same image source as needed
//   //           logoSrc: "/logo-3percenttax.png", // Same logo source as needed
//   //           title: "Tax Planning Report", // Change title as needed
//   //           subtitle: "Presented by Norman Dotch", // Change presenter name as needed

//   //           strategiesTableData: fmdVar,
//   //           riskAssessmentStatus: riskAssessmentStatus,
//   //         });
//   //       };
//   //       fmd();
//   //     }
//   //   };

//   useEffect(() => {
//     fetchTaxPlanData();
//   }, [startegyList]);

//   useEffect(() => {
//     initializePdfGenrWithData();
//   }, [results]);

//   useEffect(() => {
//     // setPeriods(props?.period);
//     setStartingAmount(props?.startingAmount);
//     setDeposit(props?.startingAmount);
//     setInterestRate(7);
//   }, []);

//   useEffect(() => {
//     if (periods && startingAmount && deposit && interestRate) {
//       calculateFutureValue();
//       initializePdfGenrWithData();
//     }
//   }, [periods, startingAmount, deposit, interestRate]);

//   const pdfPages = [
//     <Intro {...introConfigData} />,
//     <ImportantInfo {...importantInfoConfigData} />,
//     <ImportantInfo1 {...importantInfo_1_Config} />,
//     <TaxSavings
//       imageSrc="/intro-pdf.png"
//       logoSrc="/logo-3percenttaxold 1.png"
//       title="Financial Report"
//       subtitle="Presented by Norman Dotch"
//       strategiesAggregatedDataForPieChart={strategiesAggregatedDataForPieChart}
//       renderCustomLabel={renderCustomLabel}
//       COLORS={COLORS}
//       CustomTooltip={CustomTooltip}
//       CustomLegendPieChart={CustomLegendPieChart}
//       legendItems={legendItems}
//       strategiestableData={transformData(BeforeAfterStrategies)}
//       taxPlanCardsData={[
//         { title: "Federal Tax Saving", value: formatToK(startingAmount) },
//         { title: "State Tax Savings", value: formatToK(stateTaxSavings) },
//         {
//           title: "No. of Strategies (Business)",
//           value: noOfBusinessStrategies,
//         },
//         {
//           title: "No. of Strategies (Individual)",
//           value: noOfIndividualStrategies,
//         },
//       ]}
//       riskAssessmentStatus={riskAssessmentStatus}
//     />,
//     <StrategyOverview {...overviewConfigData} />,
//   ];

//   // const pdfPages = [
//   //   <Intro {...introConfigData} />,
//   //   <ImportantInfo {...importantInfoConfigData} />,
//   //   <ImportantInfo1 {...importantInfo_1_Config} />,
//   //   <TaxSavings
//   //     imageSrc="/intro-pdf.png"
//   //     logoSrc="/logo-3percenttax.png"
//   //     title="Financial Report"
//   //     subtitle="Presented by Norman Dotch"
//   //     strategiesAggregatedDataForPieChart={strategiesAggregatedDataForPieChart}
//   //     renderCustomLabel={renderCustomLabel}
//   //     COLORS={COLORS}
//   //     CustomTooltip={CustomTooltip}
//   //     CustomLegendPieChart={CustomLegendPieChart}
//   //     legendItems={legendItems}
//   //     strategiestableData={transformData(BeforeAfterStrategies)}
//   //     taxPlanCardsData={[
//   //       { title: "Federal Tax Saving", value: formatToK(startingAmount) },
//   //       { title: "State Tax Savings", value: formatToK(stateTaxSavings) },
//   //       {
//   //         title: "No. of Strategies (Business)",
//   //         value: noOfBusinessStrategies,
//   //       },
//   //       {
//   //         title: "No. of Strategies (Individual)",
//   //         value: noOfIndividualStrategies,
//   //       },
//   //     ]}
//   //     riskAssessmentStatus={riskAssessmentStatus}
//   //   />,
//   //   <StrategyOverview {...overviewConfigData} />,
//   // ];

//   return (
//     <Container ref={fullPageRef} maxWidth="" sx={{ mt: 0 }}>
//       <Box>
//         {results && !loading ? (
//           <PDFGenerator pages={pdfPages} />
//         ) : (
//           <Box display={"flex"}>
//             <CircularProgress />
//           </Box>
//         )}
//       </Box>

//       <Grid container spacing={3}></Grid>
//     </Container>
//   );
// };

// export default FutureValueCalculator;

// const fetchBeforeAfterData = async (tax_plan_id) => {
//   try {
//     const response = await apiClient.get(`/tax-plan/${tax_plan_id}/`);

//     if (response.ok) {
//       const assignedStrategies =
//         response?.data?.data?.taxPlan?.assignedStrategies || [];
//       const currentTaxPlan = response?.data?.data?.taxPlan;

//       if (assignedStrategies.length > 0 && currentTaxPlan) {
//         const totalFedTaxSavings = assignedStrategies.reduce(
//           (acc, strategy) => acc + (strategy?.federalTaxSavings || 0),
//           0
//         );
//         const totalStateTaxSavings = assignedStrategies.reduce(
//           (acc, strategy) => acc + (strategy?.stateTaxSavings || 0),
//           0
//         );
//         const totalTaxSavings = totalFedTaxSavings + totalStateTaxSavings;

//         const taxableIncomeBeforeStrategies =
//           currentTaxPlan?.taxableIncome || 0;
//         const taxableIncomeAfterStrategies =
//           taxableIncomeBeforeStrategies - totalTaxSavings;

//         const taxToPayBeforeStrategies =
//           (currentTaxPlan?.marginalRate * taxableIncomeBeforeStrategies) / 100;
//         const taxToPayAfterStrategies =
//           (currentTaxPlan?.marginalRate * taxableIncomeAfterStrategies) / 100;

//         return {
//           before: {
//             taxableIncome: taxableIncomeBeforeStrategies,
//             taxToPay: taxToPayBeforeStrategies,
//           },
//           after: {
//             taxableIncome: taxableIncomeAfterStrategies,
//             taxToPay: taxToPayAfterStrategies,
//           },
//         };
//       }
//     } else {
//       throw new Error("Failed to fetch tax plan data");
//     }
//   } catch (error) {
//     console.error("Error fetching data", error);
//     return null; // Return null or handle error as needed
//   }
// };

// const getTaxSavingsArray = (strategies) => {
//   return strategies.map((strategy) => {
//     const totalTaxSavings =
//       parseFloat(strategy.federalTaxSavings) +
//       parseFloat(strategy.stateTaxSavings);

//     return {
//       name: strategy.strategyName,
//       value: totalTaxSavings,
//     };
//   });
// };

// const renderCustomLabel = (riskAssessmentStatus) => (props) => {
//   const { cx, cy, midAngle, innerRadius, outerRadius, index } = props; // Keep only what you need from props
//   const RADIAN = Math.PI / 180;
//   const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="#333"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//       fontSize="14px"
//       fontWeight="bold"
//     >
//       {riskAssessmentStatus ? `${props.name}` : `Strategy ${index + 1}`}
//     </text>
//   );
// };

// // const renderCustomLabel = (props) => {
// //   const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
// //   const RADIAN = Math.PI / 180;
// //   const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
// //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
// //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

// //   // Determine the label based on riskAssessmentType prop
// //   const label = props?.riskAssessmentStatus
// //     ? `${props.name}: $${props.value.toLocaleString()}`
// //     : `Strategy ${index + 1}: $${props.value.toLocaleString()}`;

// //   return (
// //     <text
// //       x={x}
// //       y={y}
// //       fill="#333"
// //       textAnchor={x > cx ? "start" : "end"}
// //       dominantBaseline="central"
// //       fontSize="14px"
// //       fontWeight="bold"
// //     >
// //       {label}
// //     </text>
// //   );
// // };

// // const renderCustomLabel = (props) => {
// //   const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
// //   const RADIAN = Math.PI / 180;
// //   const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
// //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
// //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

// //   return (
// //     <text
// //       x={x}
// //       y={y}
// //       fill="#333"
// //       textAnchor={x > cx ? "start" : "end"}
// //       dominantBaseline="central"
// //       fontSize="14px"
// //       fontWeight="bold"
// //     >
// //       {`  ${props.name}: $${props.value.toLocaleString()}`}
// //     </text>
// //   );
// // };
// const calculateTotal = (data) => {
//   return data.reduce((sum, entry) => sum + entry.value, 0);
// };
// const calculateTotalSavings = (federalTaxSavings, stateTaxSavings) => {
//   return federalTaxSavings + stateTaxSavings;
// };

// const CustomLegendPieChart = ({ items, riskAssessmentStatus }) => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexWrap: "wrap",
//         alignItems: "center",
//         justifyContent: "center", // Center the legend items
//         padding: "10px",
//         marginTop: "30px", // Add some spacing between the chart and the legend
//       }}
//     >
//       {items.map((item, index) => (
//         <div
//           key={index}
//           style={{ display: "flex", alignItems: "center", margin: "5px" }}
//         >
//           <div
//             style={{
//               width: "12px",
//               height: "12px",
//               backgroundColor: item.color,
//               marginRight: "5px",
//             }}
//           ></div>
//           <div
//             style={{
//               fontSize: "14px",
//               fontWeight: "500",
//             }}
//           >
//             {riskAssessmentStatus ? item.name : `Strategy ${index + 1}`}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// // const CustomLegendPieChart = ({ items }) => {
// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         flexWrap: "wrap",
// //         alignItems: "center",
// //         justifyContent: "center", // Center the legend items
// //         padding: "10px",
// //         marginTop: "30px", // Add some spacing between the chart and the legend
// //       }}
// //     >
// //       {items.map((item, index) => (
// //         <div
// //           key={index}
// //           style={{ display: "flex", alignItems: "", margin: "5px" }}
// //         >
// //           <div
// //             style={{
// //               width: "12px",
// //               // marginTop: 13,
// //               height: "12px",
// //               backgroundColor: item.color,
// //               // display: "inline-block",
// //               marginRight: "5px",
// //             }}
// //           ></div>
// //           <div
// //             style={{
// //               fontSize: "14px",
// //               fontWeight: "500",
// //               // backgroundColor: "red",
// //               // marginTop: "12px",
// //             }}
// //           >
// //             {item.name}
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// const transformData = (data = { before: {}, after: {} }) => {
//   // Ensure that 'before' and 'after' exist with default empty objects
//   // console.log("I am before:", data);

//   return Object.keys(data?.before || {}).map((key) => {
//     return {
//       feature:
//         key === "taxableIncome"
//           ? "Taxable Income"
//           : key === "taxToPay"
//           ? "Tax Bill"
//           : key,
//       before: data?.before[key] ?? 0, // Use default value if undefined
//       after: data?.after[key] ?? 0, // Use default value if undefined
//     };
//   });
// };

// const formatStrategiesTableData = (data) => {
//   const strategiesMap = new Map(); // To track strategies by name

//   data.forEach((strategy) => {
//     const savings = calculateTotalSavings(
//       strategy.federalTaxSavings,
//       strategy.stateTaxSavings
//     );

//     // If the strategy already exists, push it into the array of that strategy
//     if (strategiesMap.has(strategy.strategyName)) {
//       strategiesMap.get(strategy.strategyName).push({
//         associated: strategy.associatedWith,
//         savings: savings,
//       });
//     } else {
//       // If it doesn't exist, create a new entry with an array for duplicates
//       strategiesMap.set(strategy.strategyName, [
//         {
//           associated: strategy.associatedWith,
//           savings: savings,
//         },
//       ]);
//     }
//   });

//   // Convert the map back to a flat array
//   return Array.from(strategiesMap.entries()).flatMap(([strategyName, values]) =>
//     values.map((value) => ({
//       strategyName: strategyName,
//       associated: value.associated,
//       savings: value.savings,
//     }))
//   );
// };

// // ////////////////////
// const TaxPlanningReport = ({ btnPressed }) => {
//   return (
//     <Box
//       bgcolor={btnPressed ? "#F2F2F2" : "#ffffff"}
//       // display={}
//       sx={{
//         // display: "flex",
//         // alignItems: "center",
//         // justifyContent: "center",
//         background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", // Modern gradient background
//         // backgroundSize: "cover",
//         // backgroundPosition: "center",
//         padding: "70px",
//         borderRadius: "12px",
//         // position: "relative", // Needed for the logo positioning
//       }}
//     >
//       <Grid
//         container
//         sx={{
//           // width: "100vh",
//           // maxWidth: "1200px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: "white",
//           paddingLeft: "220px",
//           paddingRight: "220px",
//           borderRadius: "12px", // Rounded corners for a modern look
//           boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for elevation
//           position: "relative",
//         }}
//         spacing={3}
//         direction="column"
//         alignItems="center"
//       >
//         <Grid item>
//           <Typography variant="h2" sx={{ fontWeight: "bold", color: "#333" }}>
//             Dr. Roshan Jardosh, DDS
//           </Typography>
//         </Grid>

//         <Grid item>
//           <Typography
//             variant="h5"
//             sx={{ color: "#00bcd4", fontWeight: "bold" }}
//           >
//             Tax Planning Report | Tax Year 2022
//           </Typography>
//         </Grid>

//         <Grid item>
//           <Typography
//             variant="subtitle1"
//             sx={{ color: "#666", textAlign: "center", maxWidth: "600px" }}
//           >
//             Presented by Norman Dotch, Tax Planner & Registered Investment
//             Adviser (RIA)
//           </Typography>
//         </Grid>

//         {/* The Logo Positioned in the Bottom Right Corner */}
//         <Box
//           component="img"
//           sx={{
//             height: 60,
//             position: "absolute",
//             bottom: 20,
//             right: 20,
//           }}
//           alt="Dotch Capital Logo"
//           src="/logo-3percenttax.png" // Replace with actual logo
//         />
//       </Grid>
//     </Box>
//   );
// };

// const DisclaimerSection = () => {
//   return (
//     <Box
//       sx={{
//         bgcolor: "white", // Light background color
//         padding: "40px",
//         borderRadius: "12px",
//         background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
//         boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for elevation
//         marginTop: "50px",
//         width: "100%", // Make it full width inside the parent container
//         overflowY: "auto", // Allow scrolling if content overflows
//       }}
//     >
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <Typography
//             variant="h2"
//             sx={{
//               fontWeight: "bold",
//               color: "#333",
//               marginTop: 7,
//             }}
//           >
//             Important Information
//           </Typography>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#666",
//               textAlign: "justify",
//               fontSize: { xs: "0.875rem", sm: "1rem", md: "1.425rem" },
//             }}
//           >
//             This Presentation, including all associated materials (collectively
//             "this Presentation") is for informational purposes and its use is
//             for the intended recipient only. Nothing in this Presentation should
//             be construed to constitute or be relied upon as providing a legal
//             opinion or providing legal advice by Dotch Capital. No
//             accountant-client relationship is created solely by your use of this
//             Presentation. Dotch Capital, its licensors and suppliers disclaim
//             all liability in connection with your use of this presentation and
//             you assume all responsibilities and obligations with respect to any
//             decisions, conclusions, opinions or actions that you may take
//             regarding your use of this Presentation.
//           </Typography>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#666",
//               textAlign: "justify",
//               fontSize: { xs: "0.875rem", sm: "1rem", md: "1.425rem" },
//               mt: 2,
//             }}
//           >
//             Any reproduction, copying or redistribution of this Presentation,
//             electronic or otherwise, in whole or in part, is strictly prohibited
//             without the express written permission of Dotch Capital.
//           </Typography>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#666",
//               textAlign: "justify",
//               fontSize: { xs: "0.875rem", sm: "1rem", md: "1.425rem" },
//               mt: 2,
//             }}
//           >
//             Any tax related information provided by this Presentation should not
//             be used or be relied upon to (i) avoid the imposition of any
//             payment, interest or penalties imposed by the U.S. Internal Revenue
//             Service or to otherwise (ii) promote, market or recommend to others
//             any tax related advice.
//           </Typography>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#666",
//               textAlign: "justify",
//               fontSize: { xs: "0.875rem", sm: "1rem", md: "1.425rem" },
//               mt: 2,
//             }}
//           >
//             This Presentation utilizes sections of the Internal Revenue Code and
//             associated regulations in effect as of the date of this
//             Presentation. Dotch Capital assumes no obligation to update this
//             Presentation in order to reflect changes in the U.S. tax laws.
//           </Typography>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#666",
//               textAlign: "justify",
//               fontSize: { xs: "0.875rem", sm: "1rem", md: "1.325rem" },
//               mt: 2,
//             }}
//           >
//             This Presentation also utilizes certain information that you may
//             have provided to Dotch Capital such as certain prior tax returns and
//             answers to certain tax related questionnaires. Neither Dotch
//             Capital, its suppliers and licensors shall be held liable for any
//             liabilities arising from any incomplete, inaccurate, missing or
//             other erroneous information provided to Dotch Capital or for any
//             errors or omissions of Dotch Capital, its suppliers and licensors
//             with respect to the use of this Presentation. You further
//             acknowledge that your use of this Presentation does not make you a
//             third party beneficiary with respect to any products or services
//             provided, supplied and/or licensed to Dotch Capital.
//           </Typography>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// const chartData = [
//   {
//     name: "Contributions",
//     amount: 852034,
//   },
//   {
//     name: "Growth",
//     amount: 2189846,
//   },
//   {
//     name: "Growth",
//     amount: 2189846,
//   },
//   {
//     name: "Growth",
//     amount: 2189846,
//   },
//   {
//     name: "Growth",
//     amount: 2189846,
//   },
//   {
//     name: "Growth",
//     amount: 2189846,
//   },

//   {
//     name: "Growth",
//     amount: 2189846,
//   },
// ];

// // ////////////////////////////////////////

// // import React, { useEffect, useState } from "react";
// // import {
// //   TextField,
// //   Button,
// //   FormControlLabel,
// //   RadioGroup,
// //   Radio,
// //   Container,
// //   Typography,
// //   Paper,
// //   Grid,
// //   Card,
// //   CardContent,
// //   Box,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// // } from "@mui/material";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // import { styled } from "@mui/system";
// // import apiClient from "../../../../../api/apiClient";
// // import { useParams } from "react-router-dom";
// // import { formatToK } from "../../../../../modules/helpers";
// // import BeforeAfterStrategiesTax from "./BeforeAfterStrategiesTax";
// // const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
// //   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
// //   borderRadius: "8px",
// // }));

// // const StyledTableHead = styled(TableHead)(({ theme }) => ({
// //   backgroundColor: "#1976d2", // Customize header background color
// // }));

// // const StyledTableCell = styled(TableCell)(({ theme }) => ({
// //   color: "white", // White text for the header
// //   fontWeight: "bold",
// //   padding: "16px 12px",
// // }));

// // const StyledTableRow = styled(TableRow)(({ theme }) => ({
// //   "&:nth-of-type(odd)": {
// //     backgroundColor: "#f5f5f5", // Light background for odd rows
// //   },
// //   "&:nth-of-type(even)": {
// //     backgroundColor: "#ffffff", // White background for even rows
// //   },
// //   "&:hover": {
// //     backgroundColor: "#e3f2fd", // Row hover effect
// //   },
// // }));

// // const StyledBodyCell = styled(TableCell)(({ theme }) => ({
// //   padding: "16px 12px", // Add padding for spacing
// //   color: "#333", // Dark text for better readability
// // }));

// // const FutureValueCalculator = (props) => {
// //   const { tax_plan_id, client_id } = useParams();
// //   const [loading, setloading] = useState(false);
// //   const [assignedStrategies, setAssignedStrategies] = useState([]);
// //   const [periods, setPeriod] = useState(10);
// //   const [startingAmount, setStartingAmount] = useState(0);
// //   const [stateTaxSavings, setstateTaxSavings] = useState(0);
// //   const [interestRate, setInterestRate] = useState(7);
// //   const [deposit, setDeposit] = useState(0);
// //   const [compounding, setCompounding] = useState("beginning");
// //   const [results, setResults] = useState(null);
// //   const COLORS = ["#14B5F0", "#434343", "#DFCF6A", "#3574E3"];

// //   const [noOfBusinessStrategies, setNoOfBusinessStrategies] = useState(0);
// //   const [noOfIndividualStrategies, setNoOfIndvidualStrategies] = useState(0);
// //   const [
// //     strategiesAggregatedDataForPieChart,
// //     setStrategiesAggregatedDataForPieChart,
// //   ] = useState([]);
// //   const [startegyList, setStartegyList] = useState([]);
// //   const legendItems = strategiesAggregatedDataForPieChart.map(
// //     (entry, index) => ({
// //       name: entry.name,
// //       color: COLORS[index % COLORS.length],
// //     })
// //   );
// //   const fetchData = async () => {
// //     setloading(true);
// //     const result = await apiClient.get(`client/${client_id}`);
// //     if (!result.ok) {
// //       toast.error("Something went wrong");
// //       setloading(false);
// //       return;
// //     }
// //     // alert(JSON.stringify(result?.data?.client?.personalInfo,))
// //     const clientsAge = result?.data?.client?.personalInfo?.age;
// //     setPeriod(67 - Number(clientsAge));
// //     // setData(result.data.clients);
// //     // setCount(result.data.count);

// //     setloading(false);
// //   };
// //   const fetchStrategies = async () => {
// //     setloading(true); // Set loading before the request
// //     // console.log("masla ");
// //     try {
// //       const response = await apiClient.get(
// //         `/tax-plan/${tax_plan_id}/strategies?page=${1}&limit=100&search=`
// //       );

// //       if (
// //         response?.data?.strategies &&
// //         Array.isArray(response?.data?.strategies) &&
// //         response?.data?.strategies?.length > 0
// //       ) {
// //         setAssignedStrategies(response?.data?.strategies);
// //         const strats = response?.data?.strategies;

// //         const businessCount = strats.filter(
// //           (item) => item.associatedWith === "business"
// //         ).length;

// //         const individualCount = strats.filter(
// //           (item) => item.associatedWith === "indvidual"
// //         ).length;

// //         setNoOfBusinessStrategies(businessCount);
// //         setNoOfIndvidualStrategies(individualCount);
// //         setStrategiesAggregatedDataForPieChart(getTaxSavingsArray(strats));
// //         setStartegyList([...strats]);
// //         // Update with the fetched data
// //       } else if (response.status === 404) {
// //         console.log("message 22");
// //         setAssignedStrategies([]); // If no data, empty the array
// //       }
// //     } catch (error) {
// //       console.error("Error fetching strategies", error); // Handle error
// //       setAssignedStrategies([]); // If no data, empty the array
// //     } finally {
// //       setloading(false); // Set loading to false after everything is done
// //     }
// //   };
// //   useEffect(() => {
// //     console.log("Useeffect");
// //     fetchData();
// //     fetchStrategies();
// //   }, []);
// //   useEffect(() => {
// //     if (assignedStrategies.length > 0) {
// //       const totalFedTaxSavings = assignedStrategies.reduce(
// //         (acc, strategy) => acc + strategy?.federalTaxSavings,
// //         0
// //       );
// //       const totalStateTaxSavings = assignedStrategies.reduce(
// //         (acc, strategy) => acc + strategy?.stateTaxSavings,
// //         0
// //       );
// //       setstateTaxSavings(totalStateTaxSavings);
// //       setStartingAmount(totalFedTaxSavings);
// //       setDeposit(totalFedTaxSavings);
// //       console.log("fvcalcl", totalFedTaxSavings);
// //     }
// //   }, [assignedStrategies]);

// //   const calculateFutureValue = () => {
// //     const data = [];
// //     const rate = parseFloat(interestRate) / 100; // Annual rate in decimal
// //     let totalDeposits = 0;
// //     let totalInterest = 0;
// //     const startBalance = parseFloat(startingAmount); // Constant starting amount

// //     let balance = startBalance; // Initial balance

// //     for (let i = 1; i <= periods; i++) {
// //       // Add deposit at the beginning of the period
// //       if (compounding === "beginning") {
// //         balance += parseFloat(deposit);
// //         totalDeposits += parseFloat(deposit);
// //       }

// //       // Calculate interest for the current period
// //       const interest = balance * rate;
// //       totalInterest += interest;

// //       // Add interest to balance
// //       balance += interest;

// //       // Add deposit at the end of the period
// //       if (compounding === "end") {
// //         balance += parseFloat(deposit);
// //         totalDeposits += parseFloat(deposit);
// //       }

// //       // Collect data for stacked chart
// //       data.push({
// //         period: i,
// //         startBalance: startBalance, // Constant starting amount
// //         deposit: compounding === "beginning" ? parseFloat(deposit) : 0,
// //         interest: interest, // Interest earned for this period
// //         endBalance: balance, // Ending balance for the period
// //         totalDeposits: totalDeposits, // Cumulative deposits
// //         totalInterest: totalInterest, // Cumulative interest
// //       });
// //     }

// //     // Update results state
// //     setResults({
// //       futureValue: balance.toFixed(2),
// //       totalDeposits: totalDeposits.toFixed(2),
// //       totalInterest: totalInterest.toFixed(2),
// //       chartData: data, // Data for the chart
// //     });
// //   };
// //   const CustomTooltip = ({ active, payload }) => {
// //     if (active && payload && payload.length) {
// //       const { name, value } = payload[0];
// //       const total = calculateTotal(strategiesAggregatedDataForPieChart);
// //       const percent = ((value / total) * 100).toFixed(2); // Calculate percentage

// //       return (
// //         <Box
// //           sx={{
// //             backgroundColor: "#ffffff",
// //             border: "1px solid #e0e0e0",
// //             borderRadius: 2,
// //             padding: 1,
// //             boxShadow: 2,
// //             textAlign: "center",
// //           }}
// //         >
// //           <Typography variant="subtitle2" color="textSecondary">
// //             {name}
// //           </Typography>
// //           <Typography variant="h6" color="#333">
// //             {`${value} (${percent}%)`}
// //           </Typography>
// //         </Box>
// //       );
// //     }
// //     return null;
// //   };

// //   useEffect(() => {
// //     // setPeriods(props?.period);
// //     setStartingAmount(props?.startingAmount);
// //     setDeposit(props?.startingAmount);
// //     setInterestRate(7);
// //   }, []);

// //   useEffect(() => {
// //     if (periods && startingAmount && deposit && interestRate) {
// //       calculateFutureValue();
// //     }
// //   }, [periods, startingAmount, deposit, interestRate]);

// //   // const calculateFutureValue = () => {
// //   //   const data = [];
// //   //   const rate = parseFloat(interestRate) / 100; // Annual rate in decimal
// //   //   let totalDeposits = 0;
// //   //   let totalInterest = 0;
// //   //   let balance = parseFloat(startingAmount); // Initial amount

// //   //   for (let i = 1; i <= periods; i++) {
// //   //     const startBalance = balance;

// //   //     // Add deposit at the beginning of the period
// //   //     if (compounding === "beginning") {
// //   //       balance += parseFloat(deposit);
// //   //       totalDeposits += parseFloat(deposit);
// //   //     }

// //   //     // Calculate interest for the current period
// //   //     const interest = balance * rate;
// //   //     totalInterest += interest;

// //   //     // Add interest to balance
// //   //     balance += interest;

// //   //     // Add deposit at the end of the period
// //   //     if (compounding === "end") {
// //   //       balance += parseFloat(deposit);
// //   //       totalDeposits += parseFloat(deposit);
// //   //     }

// //   //     // Collect data for accumulated chart
// //   //     data.push({
// //   //       period: i,
// //   //       startBalance: startBalance, // Starting balance of the period
// //   //       deposit: compounding === "beginning" ? parseFloat(deposit) : 0,
// //   //       interest: interest, // Interest earned for this period
// //   //       endBalance: balance, // Ending balance for the period
// //   //       totalDeposits: totalDeposits, // Cumulative deposits
// //   //       totalInterest: totalInterest, // Cumulative interest
// //   //     });
// //   //   }

// //   //   // Update results state
// //   //   setResults({
// //   //     futureValue: balance.toFixed(2),
// //   //     totalDeposits: totalDeposits.toFixed(2),
// //   //     totalInterest: totalInterest.toFixed(2),
// //   //     chartData: data, // Data for the chart
// //   //   });
// //   // };
// //   // const calculateFutureValue = () => {
// //   //   const data = [];
// //   //   const rate = parseFloat(interestRate) / 100; // Annual rate in decimal
// //   //   let totalDeposits = 0;
// //   //   let totalInterest = 0;

// //   //   let balance = parseFloat(startingAmount); // Initial amount
// //   //   for (let i = 1; i <= periods; i++) {
// //   //     // Store the starting balance before any operations
// //   //     const startBalance = balance;

// //   //     // Add deposit at the beginning of the period
// //   //     if (compounding === "beginning") {
// //   //       balance += parseFloat(deposit);
// //   //       totalDeposits += parseFloat(deposit);
// //   //     }

// //   //     // Calculate interest for the current period
// //   //     const interest = balance * rate;
// //   //     totalInterest += interest;

// //   //     // Add interest to balance
// //   //     balance += interest;

// //   //     // Add deposit at the end of the period
// //   //     if (compounding === "end") {
// //   //       balance += parseFloat(deposit);
// //   //       totalDeposits += parseFloat(deposit);
// //   //     }

// //   //     // Collect data for charting
// //   //     data.push({
// //   //       period: i,
// //   //       startBalance: startBalance, // Store starting balance for this period
// //   //       deposit: compounding === "beginning" ? parseFloat(deposit) : 0, // Show deposit for beginning
// //   //       interest: interest,
// //   //       endBalance: balance, // Store ending balance for this period
// //   //     });
// //   //   }

// //   //   // Update results state
// //   //   setResults({
// //   //     futureValue: balance.toFixed(2),
// //   //     totalDeposits: totalDeposits.toFixed(2),
// //   //     totalInterest: totalInterest.toFixed(2),
// //   //     chartData: data,
// //   //   });
// //   // };

// //   return (
// //     <Container maxWidth="" sx={{ mt: 0 }}>
// //       {/* <h5 className="text-[18px] font-semibold mb-4">
// //         Tax savings by the end of this year
// //       </h5> */}
// //       <Typography variant="h6" mb={2} sx={{ fontWeight: "bold" }}>
// //         Tax savings by the end of this year
// //       </Typography>

// //       <div className="w-full gap-x-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
// //         <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
// //           <h5 className="text-[17px] font-medium ">Federal Tax Savings</h5>
// //           <h5 className="text-3xl font-semibold ">
// //             {formatToK(startingAmount)}
// //           </h5>
// //         </div>
// //         <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
// //           <h5 className="text-[17px] font-medium">State Tax Savings</h5>
// //           <h5 className="text-3xl font-semibold">
// //             {formatToK(stateTaxSavings)}
// //           </h5>
// //         </div>

// //         <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
// //           <h5 className="text-[17px] font-medium">
// //             Number of Strategies(Business)
// //           </h5>
// //           <h5 className="text-3xl font-semibold">{noOfBusinessStrategies}</h5>
// //         </div>
// //         <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
// //           <h5 className="text-[17px] font-medium">
// //             Number of Strategies(Indvidual)
// //           </h5>
// //           <h5 className="text-3xl font-semibold">{noOfIndividualStrategies}</h5>
// //         </div>
// //       </div>

// //       {/* <div className="w-full gap-x-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
// //         <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
// //           <h5 className="text-[17px] font-medium ">Federal Tax Savings</h5>
// //           <h5 className="text-3xl font-semibold ">
// //             {formatToK(startingAmount)}
// //           </h5>
// //         </div>
// //         <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
// //           <h5 className="text-[17px] font-medium">State Tax Savings</h5>
// //           <h5 className="text-3xl font-semibold">
// //             {formatToK(stateTaxSavings)}
// //           </h5>
// //         </div>
// //         <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
// //           <h5 className="text-[17px] font-medium">
// //             No of Strategies(Business)
// //           </h5>
// //           <h5 className="text-3xl font-semibold">{noOfBusinessStrategies}</h5>
// //         </div>
// //         <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
// //           <h5 className="text-[17px] font-medium">
// //             No of Strategies(Indvidual)
// //           </h5>
// //           <h5 className="text-3xl font-semibold">{noOfIndividualStrategies}</h5>
// //         </div>
// //       </div> */}
// //       {/* <h5 className="text-[18px] font-semibold mb-4">
// //         Total Tax Savings by Retirement
// //       </h5> */}
// //       <BeforeAfterStrategiesTax />
// //       <Grid container spacing={3}>
// //         <Typography
// //           variant="h6"
// //           mb={2}
// //           ml={3}
// //           mt={3}
// //           sx={{ fontWeight: "bold", color: "#333" }}
// //         >
// //           Tax Planning Pays off!
// //         </Typography>

// //         {/* <Grid item xs={12} sm={4}> */}
// //         {/* <Card sx={{ p: 0.7, boxShadow: 3, borderRadius: 3 }}>
// //             <CardContent>
// //               <Typography variant="h6" sx={{ mb: 2 }}>
// //                 Modify the values and click the{" "}
// //                 <span style={{ fontWeight: "bold", color: "#388e3c" }}>
// //                   Calculate
// //                 </span>{" "}
// //                 button.
// //               </Typography>

// //               <Grid container spacing={2}>
// //                 <Grid item xs={12} sm={12}>
// //                   <TextField
// //                     fullWidth
// //                     label="Number of Periods (N)"
// //                     type="number"
// //                     value={periods}
// //                     onChange={(e) => setPeriods(parseFloat(e.target.value))}
// //                     variant="outlined"
// //                     InputLabelProps={{ shrink: true }}
// //                     sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
// //                   />
// //                 </Grid>
// //                 <Grid item xs={12} sm={12}>
// //                   <TextField
// //                     fullWidth
// //                     label="Starting Amount (PV)"
// //                     type="number"
// //                     value={startingAmount}
// //                     onChange={(e) =>
// //                       setStartingAmount(parseFloat(e.target.value))
// //                     }
// //                     InputProps={{
// //                       startAdornment: <Typography>$</Typography>,
// //                     }}
// //                     variant="outlined"
// //                     InputLabelProps={{ shrink: true }}
// //                     sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
// //                   />
// //                 </Grid>
// //                 <Grid item xs={12} sm={12}>
// //                   <TextField
// //                     fullWidth
// //                     label="Interest Rate (I/Y)"
// //                     type="number"
// //                     value={interestRate}
// //                     onChange={(e) =>
// //                       setInterestRate(parseFloat(e.target.value))
// //                     }
// //                     InputProps={{
// //                       endAdornment: <Typography>%</Typography>,
// //                     }}
// //                     variant="outlined"
// //                     InputLabelProps={{ shrink: true }}
// //                     sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
// //                   />
// //                 </Grid>
// //                 <Grid item xs={12} sm={12}>
// //                   <TextField
// //                     fullWidth
// //                     label="Periodic Deposit (PMT)"
// //                     type="number"
// //                     value={deposit}
// //                     onChange={(e) => setDeposit(parseFloat(e.target.value))}
// //                     InputProps={{
// //                       startAdornment: <Typography>$</Typography>,
// //                     }}
// //                     variant="outlined"
// //                     InputLabelProps={{ shrink: true }}
// //                     sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                   <RadioGroup
// //                     value={compounding}
// //                     onChange={(e) => setCompounding(e.target.value)}
// //                     row
// //                   >
// //                     <FormControlLabel
// //                       value="beginning"
// //                       control={<Radio />}
// //                       label="Beginning of Period"
// //                       sx={{ color: "#388e3c" }}
// //                     />
// //                     <FormControlLabel
// //                       value="end"
// //                       control={<Radio />}
// //                       label="End of Period"
// //                     />
// //                   </RadioGroup>
// //                 </Grid>
// //                 <Grid item xs={12}>
// //                   <Button
// //                     variant="contained"
// //                     color="primary"
// //                     fullWidth
// //                     sx={{ p: 2 }}
// //                     onClick={calculateFutureValue}
// //                   >
// //                     Calculate
// //                   </Button>
// //                 </Grid>
// //               </Grid>
// //             </CardContent>
// //           </Card> */}
// //         {/* <Grid item xs={12}>
// //                   <Button
// //                     variant="contained"
// //                     color="primary"
// //                     fullWidth
// //                     sx={{ p: 2 }}
// //                     onClick={calculateFutureValue}
// //                   >
// //                     Calculate
// //                   </Button>
// //                 </Grid> */}
// //         {/* </Grid> */}

// //         <Grid ml={2} item xs={12} sm={12}>
// //           {results && (
// //             <Box>
// //               <Grid sx={{ boxShadow: 0, borderRadius: 3 }}>
// //                 <Box>
// //                   {loading ? (
// //                     "Loadingg.."
// //                   ) : (
// //                     <Grid className="flex" container spacing={2}>
// //                       {/* Accumulated Stacked Bar Chart */}

// //                       <Grid
// //                         borderRadius={3}
// //                         bgcolor={"white"}
// //                         item
// //                         xs={12}
// //                         sm={12}
// //                       >
// //                         <Box
// //                           sx={{
// //                             padding: 3,
// //                           }}
// //                         >
// //                           <ResponsiveContainer width="100%" height={400}>
// //                             <BarChart data={results.chartData}>
// //                               <XAxis
// //                                 dataKey="period"
// //                                 tick={{ fill: "#666", fontSize: 12 }}
// //                               />
// //                               <YAxis
// //                                 tickFormatter={(value) =>
// //                                   `$${formatToK(value)}`
// //                                 }
// //                                 tick={{ fill: "#666", fontSize: 12 }}
// //                               />
// //                               <Tooltip
// //                                 formatter={(value) => `$${value}`}
// //                                 cursor={{ fill: "transparent" }}
// //                               />
// //                               <Legend wrapperStyle={{ paddingTop: 20 }} />

// //                               <Bar
// //                                 dataKey="startBalance"
// //                                 stackId="a"
// //                                 fill="#14B5F0"
// //                                 name="Starting Amount"
// //                                 barSize={40}
// //                               />
// //                               <Bar
// //                                 dataKey="totalDeposits"
// //                                 stackId="a"
// //                                 fill="#rgb(67,67,67)"
// //                                 name="Deposits"
// //                                 barSize={40}
// //                               />
// //                               <Bar
// //                                 dataKey="totalInterest"
// //                                 stackId="a"
// //                                 fill="#DFCF6A"
// //                                 name="Interest"
// //                                 barSize={40}
// //                               />
// //                             </BarChart>
// //                           </ResponsiveContainer>
// //                         </Box>
// //                       </Grid>

// //                       {/* <Grid item xs={12} sm={12}>
// //                         <ResponsiveContainer width="100%" height={400}>
// //                           <BarChart data={results?.chartData}>
// //                             <XAxis dataKey="period" />
// //                             <YAxis
// //                               tickFormatter={(value) => `$${formatToK(value)}`}
// //                             />
// //                             <Tooltip formatter={(value) => `$${value}`} />
// //                             <Legend />

// //                             <Bar
// //                               dataKey="startBalance"
// //                               stackId="a"
// //                               fill="#79B5F3"
// //                               name="Starting Amount"
// //                             />
// //                             <Bar
// //                               dataKey="totalDeposits"
// //                               stackId="a"
// //                               fill="#8884D8"
// //                               name="Deposits"
// //                             />
// //                             <Bar
// //                               dataKey="totalInterest"
// //                               stackId="a"
// //                               fill="#FF7F7F"
// //                               name="Interest"
// //                             />
// //                           </BarChart>
// //                         </ResponsiveContainer>
// //                       </Grid> */}

// //                       {/* Updated Pie Chart */}

// //                       <Typography
// //                         variant="h6"
// //                         mb={2}
// //                         mt={5}
// //                         sx={{ fontWeight: "bold" }}
// //                       >
// //                         Strategy Savings Breakdown
// //                       </Typography>
// //                       <Grid
// //                         width={"100%"}
// //                         bgcolor={"#fff"}
// //                         container
// //                         p={2}
// //                         borderRadius={3}
// //                       >
// //                         {/* className=
// //                         {` ${docmode === "pdf_gen" ? " flex flex-col" : ""}`} */}
// //                         <Grid item xs={12} lg={6}>
// //                           <Box>
// //                             <div style={{ breakBefore: "page" }}>
// //                               <ResponsiveContainer width="100%" height={400}>
// //                                 <PieChart>
// //                                   <Pie
// //                                     data={strategiesAggregatedDataForPieChart}
// //                                     dataKey="value"
// //                                     nameKey="name"
// //                                     cx="50%"
// //                                     cy="50%"
// //                                     innerRadius={0}
// //                                     outerRadius={150}
// //                                     fill="#8884d8"
// //                                     labelLine={true}
// //                                     label={renderCustomLabel}
// //                                     paddingAngle={1}
// //                                     stroke="#e0e0e0"
// //                                   >
// //                                     {strategiesAggregatedDataForPieChart.map(
// //                                       (entry, index) => (
// //                                         <Cell
// //                                           key={`cell-${index}`}
// //                                           fill={COLORS[index % COLORS.length]}
// //                                         />
// //                                       )
// //                                     )}
// //                                   </Pie>
// //                                   <Tooltip content={<CustomTooltip />} />
// //                                   {/* <Legend
// //                                     align="center"
// //                                     verticalAlign="bottom"
// //                                     iconType="circle"
// //                                     wrapperStyle={{
// //                                       fontSize: "14px",
// //                                       marginTop: 30,
// //                                       fontWeight: "500",
// //                                     }}
// //                                   /> */}
// //                                 </PieChart>
// //                               </ResponsiveContainer>
// //                               <CustomLegendPieChart items={legendItems} />
// //                             </div>
// //                           </Box>
// //                         </Grid>
// //                         <Grid item xs={12} lg={6}>
// //                           <Box sx={{ p: 3 }}>
// //                             <Typography
// //                               variant="h5"
// //                               gutterBottom
// //                               align="center"
// //                             >
// //                               Strategy Overview
// //                             </Typography>
// //                             <Box
// //                               sx={{
// //                                 maxHeight: 400,
// //                                 overflowY: "scroll",
// //                               }}
// //                             >
// //                               <TableContainer component={Paper}>
// //                                 <Table>
// //                                   <TableHead>
// //                                     <TableRow>
// //                                       <TableCell sx={{ fontWeight: "bold" }}>
// //                                         Strategy Name
// //                                       </TableCell>
// //                                       <TableCell sx={{ fontWeight: "bold" }}>
// //                                         Associated For
// //                                       </TableCell>
// //                                       <TableCell sx={{ fontWeight: "bold" }}>
// //                                         Total Savings
// //                                       </TableCell>
// //                                     </TableRow>
// //                                   </TableHead>
// //                                   <TableBody>
// //                                     {startegyList.map((strategy, index) => (
// //                                       <TableRow key={index}>
// //                                         <TableCell>
// //                                           {strategy.strategyName}
// //                                         </TableCell>
// //                                         <TableCell>
// //                                           {strategy.associatedWith}
// //                                         </TableCell>
// //                                         <TableCell>
// //                                           $
// //                                           {calculateTotalSavings(
// //                                             strategy.federalTaxSavings,
// //                                             strategy.stateTaxSavings
// //                                           )}
// //                                         </TableCell>
// //                                       </TableRow>
// //                                     ))}
// //                                   </TableBody>
// //                                 </Table>
// //                               </TableContainer>
// //                             </Box>
// //                           </Box>
// //                         </Grid>
// //                       </Grid>

// //                       {/* <Grid item xs={12} sm={12} mt={8}>
// //                         <ResponsiveContainer width={"100%"} height={400}>
// //                           <PieChart>
// //                             <Pie
// //                               data={strategiesAggregatedDataForPieChart}
// //                               cx="50%"
// //                               cy="50%"
// //                               outerRadius={160}
// //                               fill="#4A90E2"
// //                               dataKey="value"
// //                               labelLine={false}
// //                               label={({ value }) => {
// //                                 // const total =
// //                                 //   parseFloat(startingAmount) +
// //                                 //   parseFloat(results.totalDeposits) +
// //                                 //   parseFloat(results.totalInterest);
// //                                 // const percent = ((value / total) * 100).toFixed(
// //                                 //   2
// //                                 // ); // Calculate percentage
// //                                 return `${value}$`; // Return percentage string
// //                               }}
// //                             >
// //                               {COLORS.map((entry, index) => (
// //                                 <Cell
// //                                   key={`cell-${index}`}
// //                                   fill={COLORS[index % COLORS.length]}
// //                                 />
// //                               ))}
// //                             </Pie>
// //                             <Tooltip formatter={(value) => `$${value}`} />
// //                           </PieChart>
// //                         </ResponsiveContainer>
// //                       </Grid> */}
// //                     </Grid>
// //                   )}
// //                 </Box>
// //               </Grid>
// //             </Box>
// //           )}
// //         </Grid>

// //         <Grid item xs={12} sm={12}>
// //           {results && 2 === 3 && (
// //             <Box>
// //               {/* <Typography variant="h4" sx={{ color: "#0074BD" }}>
// //                 Tax Planning Pays off!
// //               </Typography> */}
// //               <Card sx={{ p: 2, boxShadow: 0, borderRadius: 3 }}>
// //                 <CardContent>
// //                   {/* <Typography
// //                     variant="h5"
// //                     gutterBottom
// //                     sx={{ color: "#0074bd" }}
// //                   >
// //                     Total Tax Savings by Retirement
// //                   </Typography>
// //                   <Typography variant="h6" sx={{ color: "#388e3c" }}>
// //                     Future Value: ${results.futureValue}
// //                   </Typography>
// //                   <Typography>
// //                     Total Deposits: ${results.totalDeposits}
// //                   </Typography>
// //                   <Typography>
// //                     Total Interest: ${results.totalInterest}
// //                   </Typography> */}

// //                   {loading ? (
// //                     "Loading.."
// //                   ) : (
// //                     <Grid container spacing={2} sx={{ mt: 3 }}>
// //                       {/* Accumulated Stacked Bar Chart */}

// //                       <Grid item xs={12} sm={12}>
// //                         <Box
// //                           sx={{
// //                             backgroundColor: "#f9f9f9",
// //                             padding: 3,
// //                             borderRadius: 2,
// //                           }}
// //                         >
// //                           <Typography
// //                             variant="h6"
// //                             align="center"
// //                             mb={2}
// //                             sx={{ fontWeight: "bold", color: "#333" }}
// //                           >
// //                             Tax Planning Pays off!
// //                           </Typography>
// //                           <ResponsiveContainer width="100%" height={400}>
// //                             <BarChart data={results.chartData}>
// //                               <XAxis
// //                                 dataKey="period"
// //                                 tick={{ fill: "#666", fontSize: 12 }}
// //                               />
// //                               <YAxis
// //                                 tickFormatter={(value) =>
// //                                   `$${formatToK(value)}`
// //                                 }
// //                                 tick={{ fill: "#666", fontSize: 12 }}
// //                               />
// //                               <Tooltip
// //                                 formatter={(value) => `$${value}`}
// //                                 cursor={{ fill: "transparent" }}
// //                               />
// //                               <Legend wrapperStyle={{ paddingTop: 20 }} />

// //                               <Bar
// //                                 dataKey="startBalance"
// //                                 stackId="a"
// //                                 fill="#79B5F3"
// //                                 name="Starting Amount"
// //                                 barSize={40}
// //                               />
// //                               <Bar
// //                                 dataKey="totalDeposits"
// //                                 stackId="a"
// //                                 fill="#8884D8"
// //                                 name="Deposits"
// //                                 barSize={40}
// //                               />
// //                               <Bar
// //                                 dataKey="totalInterest"
// //                                 stackId="a"
// //                                 fill="#FF7F7F"
// //                                 name="Interest"
// //                                 barSize={40}
// //                               />
// //                             </BarChart>
// //                           </ResponsiveContainer>
// //                         </Box>
// //                       </Grid>

// //                       {/* Updated Pie Chart */}

// //                       <Grid item xs={12} sm={12}>
// //                         <Box
// //                           sx={{
// //                             backgroundColor: "#f9f9f9",
// //                             padding: 3,
// //                             borderRadius: 2,
// //                           }}
// //                         >
// //                           <Typography
// //                             variant="h6"
// //                             align="center"
// //                             mb={2}
// //                             sx={{ fontWeight: "bold" }}
// //                           >
// //                             Strategy Savings Breakdown
// //                           </Typography>
// //                           <ResponsiveContainer width="100%" height={400}>
// //                             <PieChart>
// //                               <Pie
// //                                 data={strategiesAggregatedDataForPieChart}
// //                                 dataKey="value"
// //                                 nameKey="name"
// //                                 cx="50%"
// //                                 cy="50%"
// //                                 innerRadius={0}
// //                                 outerRadius={150}
// //                                 fill="#8884d8"
// //                                 labelLine={false}
// //                                 label={renderCustomLabel}
// //                                 paddingAngle={1}
// //                                 stroke="#e0e0e0"
// //                               >
// //                                 {strategiesAggregatedDataForPieChart.map(
// //                                   (entry, index) => (
// //                                     <Cell
// //                                       key={`cell-${index}`}
// //                                       fill={COLORS[index % COLORS.length]}
// //                                     />
// //                                   )
// //                                 )}
// //                               </Pie>
// //                               <Tooltip content={<CustomTooltip />} />
// //                               {/* <Tooltip
// //                                 formatter={(value) =>
// //                                   `$${value.toLocaleString()}`
// //                                 }
// //                               /> */}
// //                               <Legend
// //                                 align="center"
// //                                 verticalAlign="bottom"
// //                                 iconType="circle"
// //                                 wrapperStyle={{
// //                                   fontSize: "14px",
// //                                   fontWeight: "500",
// //                                 }}
// //                               />
// //                             </PieChart>
// //                           </ResponsiveContainer>
// //                         </Box>
// //                       </Grid>

// //                       {/* <Grid item xs={12} sm={12}>
// //                         <ResponsiveContainer width={"100%"} height={600}>
// //                           <PieChart>
// //                             <Pie
// //                               data={strategiesAggregatedDataForPieChart}
// //                               cx="50%"
// //                               cy="50%"
// //                               outerRadius={160}
// //                               fill="#4A90E2"
// //                               dataKey="value"
// //                               labelLine={false}
// //                               label={({ value }) => {
// //                                 // const total =
// //                                 //   parseFloat(startingAmount) +
// //                                 //   parseFloat(results.totalDeposits) +
// //                                 //   parseFloat(results.totalInterest);
// //                                 // const percent = ((value / total) * 100).toFixed(
// //                                 //   2
// //                                 // ); // Calculate percentage
// //                                 return `${value}$`; // Return percentage string
// //                               }}
// //                             >
// //                               {COLORS.map((entry, index) => (
// //                                 <Cell
// //                                   key={`cell-${index}`}
// //                                   fill={COLORS[index % COLORS.length]}
// //                                 />
// //                               ))}
// //                             </Pie>
// //                             <Tooltip formatter={(value) => `$${value}`} />
// //                           </PieChart>
// //                         </ResponsiveContainer>
// //                       </Grid> */}
// //                     </Grid>
// //                   )}
// //                 </CardContent>
// //               </Card>
// //             </Box>
// //           )}
// //         </Grid>

// //         {/* <Grid item xs={12} sm={8}>
// //           {results && (
// //             <Box>
// //               <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
// //                 <CardContent>
// //                   <Typography
// //                     variant="h5"
// //                     gutterBottom
// //                     sx={{ color: "#4caf50" }}
// //                   >
// //                     Results
// //                   </Typography>
// //                   <Typography variant="h6" sx={{ color: "#388e3c" }}>
// //                     Future Value: ${results.futureValue}
// //                   </Typography>
// //                   <Typography>
// //                     Total Deposits: ${results.totalDeposits}
// //                   </Typography>
// //                   <Typography>
// //                     Total Interest: ${results.totalInterest}
// //                   </Typography>

// //                   <Grid container spacing={2} sx={{ mt: 3 }}>
// //                     <Grid item xs={12} sm={6}>
// //                       <ResponsiveContainer width="100%" height={300}>
// //                         <BarChart data={results?.chartData}>
// //                           <XAxis dataKey="period" />
// //                           <YAxis tickFormatter={(value) => `$${value}`} />
// //                           <Tooltip formatter={(value) => `$${value}`} />
// //                           <Legend />
// //                           <Bar
// //                             dataKey="endBalance"
// //                             stackId="a"
// //                             fill="#1976D2"
// //                           />
// //                           <Bar dataKey="deposit" stackId="a" fill="#388E3C" />
// //                           <Bar dataKey="interest" stackId="a" fill="#DF2528" />

// //                         </BarChart>
// //                       </ResponsiveContainer>
// //                     </Grid>
// //                     <Grid item xs={12} sm={6}>
// //                       <ResponsiveContainer width={"100%"} height={300}>
// //                         <PieChart>
// //                           <Pie
// //                             data={[
// //                               {
// //                                 name: "Starting Amount",
// //                                 value: parseFloat(startingAmount),
// //                               },
// //                               {
// //                                 name: "Deposits",
// //                                 value: parseFloat(results.totalDeposits),
// //                               },
// //                               {
// //                                 name: "Interest",
// //                                 value: parseFloat(results.totalInterest),
// //                               },
// //                             ]}
// //                             cx="50%"
// //                             cy="50%"
// //                             outerRadius={100}
// //                             fill="#8884d8"
// //                             dataKey="value"
// //                             labelLine={false}
// //                             label={({ value }) => {
// //                               const total =
// //                                 parseFloat(startingAmount) +
// //                                 parseFloat(results.totalDeposits) +
// //                                 parseFloat(results.totalInterest);
// //                               const percent = ((value / total) * 100).toFixed(
// //                                 2
// //                               ); // Calculate percentage
// //                               return `${percent}%`; // Return percentage string
// //                             }}
// //                           >
// //                             {COLORS.map((entry, index) => (
// //                               <Cell
// //                                 key={`cell-${index}`}
// //                                 fill={COLORS[index % COLORS.length]}
// //                               />
// //                             ))}
// //                           </Pie>
// //                           <Tooltip formatter={(value) => `$${value}`} />
// //                         </PieChart>
// //                       </ResponsiveContainer>
// //                     </Grid>
// //                   </Grid>
// //                 </CardContent>
// //               </Card>
// //             </Box>
// //           )}
// //         </Grid> */}
// //       </Grid>

// //       {/* <Card sx={{ mt: 2, boxShadow: 3, borderRadius: 3 }}>
// //         <CardContent>
// //           <Typography variant="h5" gutterBottom sx={{ color: "#4caf50" }}>
// //             Detailed Breakdown
// //           </Typography>
// //           <TableContainer
// //             component={Paper}
// //             sx={{
// //               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
// //               borderRadius: "8px",
// //             }}
// //           >
// //             <Table>
// //               <TableHead sx={{ backgroundColor: "#1976d2" }}>
// //                 <TableRow>
// //                   <TableCell
// //                     sx={{
// //                       color: "white",
// //                       fontWeight: "bold",
// //                       padding: "16px 12px",
// //                     }}
// //                   >
// //                     Period
// //                   </TableCell>
// //                   <TableCell
// //                     sx={{
// //                       color: "white",
// //                       fontWeight: "bold",
// //                       padding: "16px 12px",
// //                     }}
// //                   >
// //                     Starting Balance
// //                   </TableCell>
// //                   <TableCell
// //                     sx={{
// //                       color: "white",
// //                       fontWeight: "bold",
// //                       padding: "16px 12px",
// //                     }}
// //                   >
// //                     Deposit
// //                   </TableCell>
// //                   <TableCell
// //                     sx={{
// //                       color: "white",
// //                       fontWeight: "bold",
// //                       padding: "16px 12px",
// //                     }}
// //                   >
// //                     Interest
// //                   </TableCell>
// //                   <TableCell
// //                     sx={{
// //                       color: "white",
// //                       fontWeight: "bold",
// //                       padding: "16px 12px",
// //                     }}
// //                   >
// //                     Ending Balance
// //                   </TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {results?.chartData &&
// //                   Array.isArray(results?.chartData) &&
// //                   results?.chartData.map((row, index) => (
// //                     <TableRow
// //                       key={index}
// //                       sx={{
// //                         "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
// //                         "&:nth-of-type(even)": { backgroundColor: "#ffffff" },
// //                         "&:hover": { backgroundColor: "#e3f2fd" },
// //                       }}
// //                     >
// //                       <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
// //                         {row.period}
// //                       </TableCell>
// //                       <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
// //                         ${row.startBalance.toFixed(2)}
// //                       </TableCell>
// //                       <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
// //                         ${row.deposit.toFixed(2)}
// //                       </TableCell>
// //                       <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
// //                         ${row.interest.toFixed(2)}
// //                       </TableCell>
// //                       <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
// //                         ${row.endBalance.toFixed(2)}
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //         </CardContent>
// //       </Card> */}
// //     </Container>
// //   );
// // };

// // export default FutureValueCalculator;

// // const getTaxSavingsArray = (strategies) => {
// //   return strategies.map((strategy) => {
// //     const totalTaxSavings =
// //       parseFloat(strategy.federalTaxSavings) +
// //       parseFloat(strategy.stateTaxSavings);

// //     return {
// //       name: strategy.strategyName,
// //       value: totalTaxSavings,
// //     };
// //   });
// // };
// // const renderCustomLabel = (props) => {
// //   const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
// //   const RADIAN = Math.PI / 180;
// //   const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
// //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
// //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

// //   return (
// //     <text
// //       x={x}
// //       y={y}
// //       fill="#333"
// //       textAnchor={x > cx ? "start" : "end"}
// //       dominantBaseline="central"
// //       fontSize="14px"
// //       fontWeight="bold"
// //     >
// //       {`  ${props.name}: $${props.value.toLocaleString()}`}
// //     </text>
// //   );
// // };
// // const calculateTotal = (data) => {
// //   return data.reduce((sum, entry) => sum + entry.value, 0);
// // };

// // const calculateTotalSavings = (federalTaxSavings, stateTaxSavings) => {
// //   return federalTaxSavings + stateTaxSavings;
// // };

// // const CustomLegendPieChart = ({ items }) => {
// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         flexWrap: "wrap",
// //         alignItems: "center",
// //         justifyContent: "center", // Center the legend items
// //         padding: "10px",
// //         marginTop: "30px", // Add some spacing between the chart and the legend
// //       }}
// //     >
// //       {items.map((item, index) => (
// //         <div
// //           key={index}
// //           style={{ display: "flex", alignItems: "", margin: "5px" }}
// //         >
// //           <div
// //             style={{
// //               width: "12px",
// //               // marginTop: 13,
// //               height: "12px",
// //               backgroundColor: item.color,
// //               // display: "inline-block",
// //               marginRight: "5px",
// //             }}
// //           ></div>
// //           <div
// //             style={{
// //               fontSize: "14px",
// //               fontWeight: "500",
// //               // backgroundColor: "red",
// //               // marginTop: "12px",
// //             }}
// //           >
// //             {item.name}
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };
