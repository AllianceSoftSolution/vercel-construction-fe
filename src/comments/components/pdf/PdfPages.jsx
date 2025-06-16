import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardHeader,
  Grid,
  Container,
  Stack,
  ListItemIcon,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatToK } from "@/modules/helpers";
import { useParams } from "react-router-dom";
const data = [
  { name: "Page A", value: 100 },
  { name: "Page B", value: 300 },
  { name: "Page C", value: 200 },
  { name: "Page D", value: 400 },
  { name: "Page E", value: 500 },
  { name: "Page F", value: 600 },
  { name: "Page G", value: 700 },
  { name: "Page H", value: 800 },
  { name: "Page I", value: 900 },
  { name: "Page J", value: 1000 },
  { name: "Page K", value: 1100 },
  { name: "Page L", value: 1200 },
  { name: "Page M", value: 1300 },
  { name: "Page N", value: 1400 },
  { name: "Page O", value: 1500 },
  { name: "Page P", value: 1600 },
  { name: "Page Q", value: 1700 },
  { name: "Page R", value: 1800 },
  { name: "Page S", value: 1900 },
  { name: "Page T", value: 2000 },
  { name: "Page U", value: 2100 },
  { name: "Page V", value: 2200 },
  { name: "Page W", value: 2300 },
  { name: "Page X", value: 2400 },
  { name: "Page Y", value: 2500 },
  { name: "Page Z", value: 2600 },
  { name: "Page AA", value: 2700 },
  { name: "Page AB", value: 2800 },
  { name: "Page AC", value: 2900 },
  { name: "Page AD", value: 3000 },
  { name: "Page AE", value: 3100 },
];
const sortedData = [...data].sort((a, b) => a.value - b.value);
const Intro = ({
  imageSrc,
  mainTitle,
  subtitle,
  additionalInfo,
  presenterName,
  presenterRole,
  footerText,
  logoSrc,
  riskAssessmentStatus,
}) => {
  return (
    <Box
      sx={{
        width: "100%", // PDF page width
        height: "100%", // PDF page height
        display: "flex",
        bgcolor: "#fff",
        flexDirection: "column",
        border: "1px solid #ddd",
        overflow: "hidden",
      }}
    >
      {/* Image at the Top */}
      <Box
        sx={{
          // bgcolor: "red",
          marginBottom: "-70px",
          width: "100%",
          height: "700px", // Adjust this height as needed
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={imageSrc} // Use imageSrc prop
          alt={mainTitle}
          style={{ width: "100%", height: "100%", objectFit: "" }} // Make image cover the entire box
        />

        {/* Overlay Text */}
        <Box
          sx={{
            width: "93%",
            position: "absolute",
            top: "20px", // Adjust as needed
            left: "20px", // Adjust as needed
            zIndex: 2,
            color: "#C2E1FF",
          }}
        >
          <Box
            sx={{
              width: 350, // Ensure a fixed width for consistency
              // height: 150, // Ensure a fixed height for consistency
              ml: 2,
              mb: 7,
              overflow: "hidden", // Ensure it doesn't overflow
            }}
          >
            <img
              src={logoSrc}
              alt="Company Logo"
              style={{ width: "100%", height: "100%", objectFit: "" }} // Keep the logo responsive
            />
          </Box>
          <Box ml={4} mt={5} display={"flex"} justifyContent={"space-between"}>
            <Typography fontWeight={"bold"} variant="h4" color={"white"}>
              {mainTitle}
            </Typography>
            <Typography fontWeight={"bold"} variant="h4" color={"white"}>
              {subtitle}
            </Typography>
          </Box>

          <Typography
            ml={4}
            textAlign={"left"}
            variant="h2"
            fontWeight={"bold"}
            color={"white"}
          >
            {additionalInfo}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end", // Align items to the right
          justifyContent: "center",
          padding: 2,
          textAlign: "right", // Right-align text
        }}
      >
        {/* <PDFText className="">Hello</PDFText> */}

        <Box display={"flex"} gap={2} mr={4}>
          <Stack direction={"column"}>
            <PDFText className="text-2xl   font-bold text-[#1261A0]">
              Presented by
            </PDFText>

            <PDFText className="text-8xl mb-8 font-bold   text-[#E45051]">
              {presenterName}
            </PDFText>

            <PDFText className=" text-3xl text-[#1261A0]">
              {presenterRole}
            </PDFText>
          </Stack>
          <Divider orientation="vertical" sx={{ bgcolor: "#1261A0" }} />
        </Box>
      </Box>

      <Box
        mt={2}
        mb={7}
        display="flex"
        justifyContent="space-between"
        alignItems="center" // Align items vertically centered
      >
        <Typography
          variant="h4"
          fontWeight={"light"}
          sx={{
            color: "#888888",
            mx: 8,
            maxWidth: "100%",
            textAlign: "left",
          }}
        >
          {footerText}
        </Typography>
      </Box>
      <Box sx={{ width: "100%", p: 2, backgroundColor: "#2690CB" }} />
    </Box>
  );
};

const ImportantInfo = ({
  imageSrc,
  logoSrc,
  title,
  subtitle,
  disclaimerItems,
  riskAssessmentStatus,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        // width: "1000px", // PDF page width
        // height: "800px", // PDF page height
        display: "flex",
        bgcolor: "#fff",
        flexDirection: "column",
        border: "1px solid #ddd",
        overflow: "hidden",
      }}
    >
      {/* Image at the Top */}
      <Box
        sx={{
          marginBottom: "",
          height: "20%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={imageSrc} // Use imageSrc prop
          style={{ width: "100%", height: "70%", objectFit: "" }} // Make image cover the entire box
        />

        {/* Overlay Text */}
        <Box
          sx={{
            width: "96%",
            position: "absolute",
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "start",
            top: "10px", // Adjust as needed
            left: "20px", // Adjust as needed
            zIndex: 2,
            color: "#C2E1FF",
          }}
        >
          <Box>
            <Typography textAlign={"left"} variant="h6" color={"white"}>
              {title}
            </Typography>
            <Typography
              textAlign={"left"}
              variant="h4"
              fontWeight={"bold"}
              color={"white"}
            >
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 290,
              height: 250,

              overflow: "hidden",
            }}
          >
            <img
              src={logoSrc}
              alt="Company Logo"
              style={{ width: "100%", objectFit: "" }} // Keep the logo responsive
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "60%",
          alignSelf: "center",
          borderRadius: 2,
          p: 0.7,
          backgroundColor: "#2690CB",
        }}
      >
        <PDFText className="text-white font-bold  text-2xl">
          Important Information
        </PDFText>
      </Box>
      <Box
        sx={{
          width: "80%",
          alignSelf: "center",
        }}
      >
        <div style={{ padding: "18px" }}>
          <List sx={{ paddingLeft: 2, margin: 0 }}>
            {disclaimerItems?.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  paddingLeft: 0,
                  display: "flex", // Use flexbox for alignment
                  alignItems: "flex-start", // Align items to the top
                }}
              >
                <ListItemIcon
                  className="custom-list-item-icon"
                  sx={{
                    // minWidth: "3px",
                    marginTop: "8px",
                    // marginRight: "8px",
                  }}
                >
                  <CircleIcon fontSize="1px" />
                </ListItemIcon>
                <Typography variant="h6" sx={{ lineHeight: "1.5" }}>
                  {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        </div>
      </Box>

      <Box
        sx={{
          width: "100%",
          p: 2,
          position: "absolute",
          bottom: 0,
          backgroundColor: "#2690CB",
        }}
      />
    </Box>
  );
};

const ImportantInfo1 = ({
  imageSrc,
  logoSrc,
  title,
  subtitle,
  currentAge,
  initialBalance,
  contributions,
  growth,
  investmentWorth,
  disclaimer,
  detailsData,
  barChartData,
  riskAssessmentStatus,
}) => {
  // const [details, setDetails] = useState([]);
  if (!detailsData || detailsData.length === 0) {
    return (
      <>
        <span>Loading....</span>
      </>
    );
  }
  //  setDetails(detailsData);
  const details = detailsData;
  console.log(barChartData, " i am bar chart data in");
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%", // PDF page width
        height: "100%", // PDF page height
        display: "flex",
        bgcolor: "#fff",
        flexDirection: "column",
        border: "1px solid #ddd",
        overflow: "hidden",
      }}
    >
      {/* Image at the Top */}
      <Box
        sx={{
          marginBottom: "",
          height: "20%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={imageSrc} // Use imageSrc prop
          style={{ width: "100%", height: "70%", objectFit: "" }}
        />

        {/* Overlay Text */}

        <Box
          sx={{
            width: "96%",
            position: "absolute",
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "start",
            top: "10px", // Adjust as needed
            left: "20px", // Adjust as needed
            zIndex: 2,
            color: "#C2E1FF",
          }}
        >
          <Box>
            <Typography textAlign={"left"} variant="h6" color={"white"}>
              {title}
            </Typography>
            <Typography
              textAlign={"left"}
              variant="h4"
              fontWeight={"bold"}
              color={"white"}
            >
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 290,
              height: 250,

              overflow: "hidden",
            }}
          >
            <img
              src={logoSrc}
              alt="Company Logo"
              style={{ width: "100%", objectFit: "" }} // Keep the logo responsive
            />
          </Box>
        </Box>

        {/* <Box
          sx={{
            width: "93%",
            position: "absolute",
            display: "flex",
            gap: 1,
            alignItems: "start",
            top: "20px", // Adjust as needed
            left: "20px", // Adjust as needed
            zIndex: 2,
            color: "#C2E1FF",
          }}
        >
          <Box
            sx={{
              width: 160, // Ensure a fixed width for consistency
              height: 160, // Ensure a fixed height for consistency
              overflow: "hidden", // Ensure it doesn't overflow
            }}
          >
            <img
              src={logoSrc}
              alt="Company Logo"
              style={{ width: "100%", objectFit: "" }} // Keep the logo responsive
            />
          </Box>

          <Box>
            <Typography textAlign={"left"} variant="h6" color={"white"}>
              {title}
            </Typography>
            <Typography
              textAlign={"left"}
              variant="h4"
              fontWeight={"bold"}
              color={"white"}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box> */}
      </Box>

      <Box
        sx={{
          width: "60%",
          alignSelf: "center",
          borderRadius: 2,
          p: 0.7,
          backgroundColor: "#2690CB",
        }}
      >
        <PDFText className="text-white font-bold  text-2xl">
          Estimated Retirement Savings
        </PDFText>
      </Box>
      <Box>
        <Typography textAlign={"left"} ml={3} mt={1}>
          <PDFText className="">
            If you invested your tax savings every single month between now and
            retirement, see how much additional you'd have in retirement.
          </PDFText>
        </Typography>
      </Box>
      <Box width={"90%"} alignSelf={"center"}>
        <Grid container sm={12}>
          <Grid item sm={4}>
            <Box
              sx={{
                padding: "12px",
                margin: "0 auto",
                overflowY: "auto",
                borderRadius: "8px",
              }}
            >
              {/* Section: Your Current Age */}
              <Box mb={1.5}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  // fontSize="0.75rem"
                >
                  YOUR CURRENT AGE
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  align="right"
                  fontWeight="bold"
                  // fontSize="0.9rem"
                >
                  {currentAge} y/o
                </Typography>
              </Box>

              {/* Section with blue header and description */}
              {details?.map((section, index) => (
                <Box key={index} mb={1.5}>
                  {/* Blue Header */}
                  <Box sx={{ backgroundColor: "#0074BD", padding: "4px 8px" }}>
                    <Typography
                      variant="subtitle2"
                      color="white"
                      // fontSize="0.75rem"
                    >
                      <PDFText>{section.label}</PDFText>
                    </Typography>
                  </Box>

                  {/* Description and Value */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    // mt={3}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      textAlign={"left"}
                      color="black"
                      sx={{ maxWidth: "75%" }}
                    >
                      {section.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      align="right"
                      fontWeight="bold"
                    >
                      {section.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item sm={8}>
            <Box sx={{ p: 3, backgroundColor: "#fff", borderRadius: 2 }}>
              <Grid container spacing={3}>
                {/* Text Component at the top */}
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {/* in 22 years */}
                    <Typography variant="body1" color="text.secondary">
                      Estimated retirement savings , your investment could be
                      worth:
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {investmentWorth}
                    </Typography>
                  </Box>
                </Grid>

                {/* Stats Section */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    INITIAL BALANCE
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    {initialBalance || "-"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    {/* 0.00% of Total */}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    CONTRIBUTIONS
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    ${contributions}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    {/* 28.00% of Total */}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    GROWTH
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    ${growth}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    {/* 72.00% of Total */}
                  </Typography>
                </Grid>

                {/* Chart Section */}
                <Grid item xs={12} sm={12}>
                  <Stack direction="column" spacing={2}>
                    {/* Chart */}
                    <Box sx={{ height: 340 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barChartData}
                          margin={{ right: 30, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis
                            dataKey="period"
                            tick={{ fill: "#666", fontSize: 12 }}
                          />
                          <YAxis
                            tickFormatter={(value) => `$${formatToK(value)}`}
                            tick={{ fill: "#666", fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value) => `$${value}`}
                            cursor={{ fill: "transparent" }}
                          />

                          {/* <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip /> */}
                          <Legend />

                          <Bar
                            dataKey="startBalance"
                            stackId="a"
                            fill="#B3D6FB" // much lighter shade of #79B5F3
                            name="Starting Amount"
                            barSize={80}
                          />
                          <Bar
                            dataKey="totalDeposits"
                            stackId="a"
                            fill="#79B5F3" // base color
                            name="Deposits"
                            barSize={80}
                          />
                          <Bar
                            dataKey="totalInterest"
                            stackId="a"
                            fill="#2A83D4" // significantly darker shade of #79B5F3
                            name="Interest"
                            barSize={80}
                          />

                          {/* <Bar
                            dataKey="startBalance"
                            stackId="a"
                            fill="#4DA6FF" // lighter shade of #0074BD
                            name="Starting Amount"
                            barSize={80}
                          />
                          <Bar
                            dataKey="totalDeposits"
                            stackId="a"
                            fill="#0074BD" // base color
                            name="Deposits"
                            barSize={80}
                          />
                          <Bar
                            dataKey="totalInterest"
                            stackId="a"
                            fill="#005A9E" // darker shade of #0074BD
                            name="Interest"
                            barSize={80}
                          /> */}

                          {/* <Bar
                            dataKey="startBalance"
                            stackId="a"
                            fill="#DFCF6A"
                            name="Starting Amount"
                            barSize={80}
                          />
                          <Bar
                            dataKey="totalDeposits"
                            stackId="a"
                            fill="#rgb(67,67,67)"
                            name="Deposits"
                            barSize={80}
                          />
                          <Bar
                            dataKey="totalInterest"
                            stackId="a"
                            fill="#14B5F0"
                            name="Interest"
                            barSize={80}
                          /> */}
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Box>
            <p
              style={{
                fontSize: 14,
                marginLeft: 5,
                marginRight: 5,
                textAlign: "left",
              }}
            >
              {disclaimer?.disc1}
            </p>
            <p
              style={{
                fontSize: 14,
                marginLeft: 5,
                marginRight: 5,
                textAlign: "left",
              }}
            >
              {disclaimer?.disc2}
            </p>
            <p
              style={{
                fontSize: 14,
                marginLeft: 5,
                marginRight: 5,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {disclaimer?.disc3}
            </p>
          </Box>
        </Grid>
      </Box>

      <Box
        sx={{
          width: "100%",
          p: 2,
          position: "absolute",
          bottom: 0,
          backgroundColor: "#2690CB",
        }}
      />
    </Box>
  );
};

const TaxSavings = ({
  imageSrc,
  logoSrc,
  title,
  subtitle,
  strategiesAggregatedDataForPieChart,
  renderCustomLabel,
  COLORS,
  CustomTooltip,
  CustomLegendPieChart,
  legendItems,
  strategiestableData,
  taxPlanCardsData,
  riskAssessmentStatus,
}) => {
  if (
    !strategiesAggregatedDataForPieChart ||
    Object.keys(strategiesAggregatedDataForPieChart).length === 0 ||
    !strategiestableData ||
    Object.keys(strategiestableData).length === 0
  ) {
    {
      return (
        <>
          <span>Loading....</span>
        </>
      );
    }
  }

  const strategyTableData = strategiestableData;
  const strategiesPieChartData = strategiesAggregatedDataForPieChart;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%", // PDF page width
        height: "100%", // PDF page height
        display: "flex",
        bgcolor: "#fff",
        flexDirection: "column",
        border: "1px solid #ddd",
        overflow: "hidden",
      }}
    >
      {/* Image at the Top */}
      <Box
        sx={{
          marginBottom: "",
          height: "20%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={imageSrc} // Use imageSrc prop
          style={{ width: "100%", height: "70%", objectFit: "" }} // Make image cover the entire box
        />

        {/* Overlay Text */}

        <Box
          sx={{
            width: "96%",
            position: "absolute",
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "start",
            top: "10px", // Adjust as needed
            left: "20px", // Adjust as needed
            zIndex: 2,
            color: "#C2E1FF",
          }}
        >
          <Box>
            <Typography textAlign={"left"} variant="h6" color={"white"}>
              {title}
            </Typography>
            <Typography
              textAlign={"left"}
              variant="h4"
              fontWeight={"bold"}
              color={"white"}
            >
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 290,
              height: 250,

              overflow: "hidden",
            }}
          >
            <img
              src={logoSrc}
              alt="Company Logo"
              style={{ width: "100%", objectFit: "" }} // Keep the logo responsive
            />
          </Box>
        </Box>

        {/* <Box
          sx={{
            width: "93%",
            position: "absolute",
            display: "flex",
            gap: 1,
            alignItems: "start",
            top: "20px", // Adjust as needed
            left: "20px", // Adjust as needed
            zIndex: 2,
            color: "#C2E1FF",
          }}
        >
          <Box
            sx={{
              width: 100, // Ensure a fixed width for consistency
              height: 100, // Ensure a fixed height for consistency
              overflow: "hidden", // Ensure it doesn't overflow
            }}
          >
            <img
              src={logoSrc}
              alt="Company Logo"
              style={{ width: "100%", objectFit: "" }} // Keep the logo responsive
            />
          </Box>

          <Box>
            <Typography textAlign={"left"} variant="h6" color={"white"}>
              {title}
            </Typography>
            <Typography
              textAlign={"left"}
              variant="h4"
              fontWeight={"bold"}
              color={"white"}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box> */}
      </Box>

      <Box
        sx={{
          width: "60%",
          alignSelf: "center",
          borderRadius: 2,
          p: 0.7,
          backgroundColor: "#2690CB",
        }}
      >
        <PDFText className="text-white font-bold  text-2xl">
          Important Information
        </PDFText>
      </Box>
      <Box
        sx={{
          width: "100%",
          alignSelf: "center",
        }}
      >
        <Box sx={{ padding: 4 }}>
          {/* Top Summary Cards */}

          <Grid container spacing={2} sx={{ marginBottom: 4 }}>
            {taxPlanCardsData?.map((card, index) => (
              <Grid item xs={3} key={index}>
                <Card
                  sx={{
                    height: 120,
                    textAlign: "center",
                    backgroundColor: "rgba(14, 149, 239, 0.03)",
                    padding: 0,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      variant="subtitle1"
                      color="text.secondary"
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* <Grid container spacing={2} sx={{ marginBottom: 4 }}>
            {[
              "Federal Tax Saving",
              "State Tax Savings",
              "No. of Strategies (Business)",
              "No. of Strategies (Individual)",
            ].map((title, index) => (
              <Grid item xs={3} key={index}>
                <Card
                  sx={{
                    height: 120,

                    textAlign: "center",
                    backgroundColor: "rgba(14, 149, 239, 0.03)",
                    padding: 0,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      variant="subtitle1"
                      color="text.secondary"
                    >
                      {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {[153, 186, 3, 5][index]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid> */}

          {/* Middle Content: Table and Pie Chart */}
          <Grid container spacing={2}>
            {/* Table */}
            <Grid
              item
              xs={5}
              display={"flex"}
              justifyContent={"space-between"}
              flexDirection={"column"}
            >
              <Card sx={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          colSpan={2}
                          sx={{
                            backgroundColor: "#2690CB",
                            color: "white",
                            fontWeight: "bold", // Optional: make the text bold
                          }}
                        >
                          Before Strategies Implementation
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor: "#2690CB",
                            color: "white",
                            fontWeight: "bold", // Optional: make the text bold
                          }}
                        >
                          After Strategies Implementation
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {strategyTableData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.label}</TableCell>
                          <TableCell align="center">{row.before}</TableCell>
                          <TableCell align="center">{row.after}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
              <Box mt={2}>
                <CustomLegendPieChart
                  riskAssessmentStatus={riskAssessmentStatus}
                  items={legendItems}
                />
              </Box>
            </Grid>

            {/* Pie Chart */}

            <Grid item xs={7}>
              <Card
                sx={{
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: 2,
                }}
              >
                <Typography variant="h6" align="left" sx={{}}>
                  Strategy Savings Breakdown
                </Typography>

                <ResponsiveContainer height={450}>
                  <PieChart>
                    <Pie
                      data={strategiesPieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={120}
                      fill="#8884d8"
                      // labelLine={true}
                      // label={renderCustomLabel}
                      label={renderCustomLabel(
                        riskAssessmentStatus,
                        strategiesPieChartData
                      )}
                      // paddingAngle={3}
                      stroke="#e0e0e0"
                    >
                      {strategiesAggregatedDataForPieChart?.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      riskAssessmentStatus={riskAssessmentStatus}
                      content={<CustomTooltip />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            width: "100%",
            p: 2,
            position: "absolute",
            bottom: 0,
            backgroundColor: "#2690CB",
          }}
        />
      </Box>
    </Box>
  );
};

const StrategyOverview = ({
  imageSrc,
  logoSrc,
  title,
  subtitle,
  strategiesTableData,
  riskAssessmentStatus,
}) => {
  const { tax_plan_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [riskLoading, setRiskLoading] = useState(true);
  const [strategies, setStrategies] = useState([]);
  const [strategyData, setStrategyData] = useState([]);
  // const strategies = Object.keys(strategiesTableData);
  // const strategyData = strategiesTableData;
  // Use effect to simulate data fetching

  useEffect(() => {
    // alert(JSON.stringify(strategiesTableData));

    if (strategiesTableData && Object.keys(strategiesTableData).length > 0) {
      setStrategies(Object.keys(strategiesTableData));
      setStrategyData(strategiesTableData);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (strategiesTableData && Object.keys(strategiesTableData).length > 0) {
      setStrategies(Object.keys(strategiesTableData));
      setStrategyData(strategiesTableData);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [strategiesTableData]);

  // Check if there is any data to display
  // if (loading) {
  //   return (
  //     <Box>
  //       <Typography variant="h6" color="textSecondary">
  //         Loading strategies...
  //       </Typography>
  //     </Box>
  //   );
  // }

  // if (!strategiesTableData || Object.keys(strategiesTableData).length === 0) {
  //   return (
  //     <Box>
  //       <Typography variant="h6" color="error">
  //         No strategies available to display.
  //       </Typography>
  //     </Box>
  //   );
  // }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%", // PDF page width
        height: "100%", // PDF page height
        display: "flex",
        bgcolor: "#fff",
        flexDirection: "column",
        border: "1px solid #ddd",
        overflow: "hidden",
      }}
    >
      {/* Image at the Top */}
      <Box
        sx={{
          marginBottom: "",
          height: "20%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={imageSrc}
          style={{ width: "100%", height: "70%", objectFit: "" }} // Ensure the image covers the box
        />

        {/* Overlay Text */}

        <Box
          sx={{
            width: "96%",
            position: "absolute",
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "start",
            top: "10px", // Adjust as needed
            left: "20px", // Adjust as needed
            zIndex: 2,
            color: "#C2E1FF",
          }}
        >
          <Box>
            <Typography textAlign={"left"} variant="h6" color={"white"}>
              {title}
            </Typography>
            <Typography
              textAlign={"left"}
              variant="h4"
              fontWeight={"bold"}
              color={"white"}
            >
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 290,
              height: 250,

              overflow: "hidden",
            }}
          >
            <img
              src={logoSrc}
              alt="Company Logo"
              style={{ width: "100%", objectFit: "" }} // Keep the logo responsive
            />
          </Box>
        </Box>

        {/* <Box
          sx={{
            width: "93%",
            position: "absolute",
            display: "flex",
            gap: 1,
            alignItems: "start",
            top: "20px",
            left: "20px",
            zIndex: 2,
            color: "#C2E1FF",
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              overflow: "hidden",
            }}
          >
            <img
              src={logoSrc}
              alt="Company Logo"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </Box>

          <Box>
            <Typography textAlign={"left"} variant="h6" color={"white"}>
              {title}
            </Typography>
            <Typography
              textAlign={"left"}
              variant="h4"
              fontWeight={"bold"}
              color={"white"}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box> */}
      </Box>

      <Box
        sx={{
          width: "60%",
          alignSelf: "center",
          borderRadius: 2,
          p: 0.7,
          backgroundColor: "#2690CB",
        }}
      >
        <PDFText className="text-white font-bold text-2xl">
          Strategy Overview
        </PDFText>
      </Box>
      <Box
        sx={{
          marginTop: 4,
          width: "90%",
          alignSelf: "center",
        }}
      >
        <Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#2690CB",
                      color: "white",
                    }}
                  >
                    Strategy Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#2690CB",
                      color: "white",
                    }}
                  >
                    Associated For
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#2690CB",
                      color: "white",
                    }}
                  >
                    Total Savings
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {strategies.map((strategy, index) => {
                  const { associated, savings, strategyName, overallIndex } =
                    strategyData[strategy];
                  return (
                    <TableRow key={index}>
                      {riskAssessmentStatus ? (
                        <TableCell>{strategyName}</TableCell>
                      ) : (
                        <TableCell>{"Strategy " + overallIndex}</TableCell>
                      )}
                      <TableCell>{associated}</TableCell>
                      <TableCell>${savings}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          p: 2,
          position: "absolute",
          bottom: 0,
          backgroundColor: "#2690CB",
        }}
      />
    </Box>
  );
};

// const StrategyOverview = ({
//   imageSrc,
//   logoSrc,
//   title,
//   subtitle,
//   strategiesTableData,
//   riskAssessmentStatus,
// }) => {
//   useEffect(() => {
//     // alert(JSON.stringify(strategiesTableData));
//   }, [strategiesTableData]);
//   const { tax_plan_id } = useParams();
//   const [loading, setloading] = useState(true);
//   const [riskLoading, setRiskLoading] = useState(true);

//   // Check if there is any data to display
//   if (!strategiesTableData || Object.keys(strategiesTableData).length === 0) {
//     return (
//       <Box>
//         <Typography variant="h6" color="error">
//           No strategies available to display.
//         </Typography>
//       </Box>
//     );
//   }

//   const strategies = Object.keys(strategiesTableData);
//   const strategyData = strategiesTableData;

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100%", // PDF page width
//         height: "100%", // PDF page height
//         display: "flex",
//         bgcolor: "#fff",
//         flexDirection: "column",
//         border: "1px solid #ddd",
//         overflow: "hidden",
//       }}
//     >
//       {/* Image at the Top */}
//       <Box
//         sx={{
//           marginBottom: "",
//           height: "20%",
//           width: "100%",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <img
//           src={imageSrc} // Use imageSrc prop
//           style={{ width: "100%", height: "70%", objectFit: "" }} // Make image cover the entire box
//         />

//         {/* Overlay Text */}
//         <Box
//           sx={{
//             width: "93%",
//             position: "absolute",
//             display: "flex",
//             gap: 1,
//             alignItems: "start",
//             top: "20px", // Adjust as needed
//             left: "20px", // Adjust as needed
//             zIndex: 2,
//             color: "#C2E1FF",
//           }}
//         >
//           <Box
//             sx={{
//               width: 100, // Ensure a fixed width for consistency
//               height: 100, // Ensure a fixed height for consistency
//               overflow: "hidden", // Ensure it doesn't overflow
//             }}
//           >
//             <img
//               src={logoSrc}
//               alt="Company Logo"
//               style={{ width: "100%", objectFit: "" }} // Keep the logo responsive
//             />
//           </Box>

//           <Box>
//             <Typography textAlign={"left"} variant="h6" color={"white"}>
//               {title}
//             </Typography>
//             <Typography
//               textAlign={"left"}
//               variant="h4"
//               fontWeight={"bold"}
//               color={"white"}
//             >
//               {subtitle}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       <Box
//         sx={{
//           width: "60%",
//           alignSelf: "center",
//           borderRadius: 2,
//           p: 0.7,
//           backgroundColor: "#2690CB",
//         }}
//       >
//         <PDFText className="text-white font-bold  text-2xl">
//           Strategy Overview
//         </PDFText>
//       </Box>
//       <Box
//         sx={{
//           marginTop: 4,
//           width: "90%",
//           alignSelf: "center",
//         }}
//       >
//         <Box>
//           {1 === 1 ? (
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell
//                       sx={{
//                         fontWeight: "bold",
//                         backgroundColor: "#2690CB",
//                         color: "white",
//                       }}
//                     >
//                       Strategy Name
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: "bold",
//                         backgroundColor: "#2690CB",
//                         color: "white",
//                       }}
//                     >
//                       Associated For
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: "bold",
//                         backgroundColor: "#2690CB",
//                         color: "white",
//                       }}
//                     >
//                       Total Savings
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {strategies.map((strategy, index) => {
//                     const { associated, savings, strategyName } =
//                       strategyData[strategy]; // Get associated and savings values
//                     return (
//                       <TableRow key={index}>
//                         {riskAssessmentStatus ? (
//                           <TableCell>{strategyName}</TableCell>
//                         ) : (
//                           <TableCell>{"Strategy " + (index + 1)}</TableCell>
//                         )}

//                         <TableCell>{associated}</TableCell>
//                         <TableCell>${savings}</TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : null}
//         </Box>
//       </Box>

//       <Box
//         sx={{
//           width: "100%",
//           p: 2,
//           position: "absolute",
//           bottom: 0,
//           backgroundColor: "#2690CB",
//         }}
//       />
//     </Box>
//   );
// };

const PDFText = ({ className = "", style = {}, children, ...props }) => {
  return (
    <span
      className={`${className} +' custom-pdf-text`}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
};

export default PDFText;

export { Intro, ImportantInfo, ImportantInfo1, TaxSavings, StrategyOverview };
