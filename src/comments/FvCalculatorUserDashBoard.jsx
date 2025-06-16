{
  /* <BeforeAfterStrategiesTax /> */
}
{
  /* <h5 className="text-[18px] font-semibold mb-4">
        Total Tax Savings by Retirement
      </h5> */
}

{
  /* <Grid item xs={12} sm={4}> */
}
{
  /* <Card sx={{ p: 0.7, boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Modify the values and click the{" "}
                <span style={{ fontWeight: "bold", color: "#388e3c" }}>
                  Calculate
                </span>{" "}
                button.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Number of Periods (N)"
                    type="number"
                    value={periods}
                    onChange={(e) => setPeriods(parseFloat(e.target.value))}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Starting Amount (PV)"
                    type="number"
                    value={startingAmount}
                    onChange={(e) =>
                      setStartingAmount(parseFloat(e.target.value))
                    }
                    InputProps={{
                      startAdornment: <Typography>$</Typography>,
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Interest Rate (I/Y)"
                    type="number"
                    value={interestRate}
                    onChange={(e) =>
                      setInterestRate(parseFloat(e.target.value))
                    }
                    InputProps={{
                      endAdornment: <Typography>%</Typography>,
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Periodic Deposit (PMT)"
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(parseFloat(e.target.value))}
                    InputProps={{
                      startAdornment: <Typography>$</Typography>,
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                  />
                </Grid>

                
                <Grid item xs={12}>
                  <RadioGroup
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value)}
                    row
                  >
                    <FormControlLabel
                      value="beginning"
                      control={<Radio />}
                      label="Beginning of Period"
                      sx={{ color: "#388e3c" }}
                    />
                    <FormControlLabel
                      value="end"
                      control={<Radio />}
                      label="End of Period"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ p: 2 }}
                    onClick={calculateFutureValue}
                  >
                    Calculate
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card> */
}
{
  /* <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ p: 2 }}
                    onClick={calculateFutureValue}
                  >
                    Calculate
                  </Button>
                </Grid> */
}
{
  /* </Grid> */
}

{
  /* <Grid item xs={12} sm={12}>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={results?.chartData}>
                            <XAxis dataKey="period" />
                            <YAxis
                              tickFormatter={(value) => `$${formatToK(value)}`}
                            />
                            <Tooltip formatter={(value) => `$${value}`} />
                            <Legend />

                            <Bar
                              dataKey="startBalance"
                              stackId="a"
                              fill="#79B5F3"
                              name="Starting Amount"
                            />
                            <Bar
                              dataKey="totalDeposits"
                              stackId="a"
                              fill="#8884D8"
                              name="Deposits"
                            />
                            <Bar
                              dataKey="totalInterest"
                              stackId="a"
                              fill="#FF7F7F"
                              name="Interest"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Grid> */
}

{
  /* Updated Pie Chart */
}

{
  /* className=
                        {` ${docmode === "pdf_gen" ? " flex flex-col" : ""}`} */
}

{
  /* <Legend
                                    align="center"
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{
                                      fontSize: "14px",
                                      marginTop: 30,
                                      fontWeight: "500",
                                    }}
                                  /> */
}

{
  /* <Grid item xs={12} sm={12} mt={8}>
                        <ResponsiveContainer width={"100%"} height={400}>
                          <PieChart>
                            <Pie
                              data={strategiesAggregatedDataForPieChart}
                              cx="50%"
                              cy="50%"
                              outerRadius={160}
                              fill="#4A90E2"
                              dataKey="value"
                              labelLine={false}
                              label={({ value }) => {
                                // const total =
                                //   parseFloat(startingAmount) +
                                //   parseFloat(results.totalDeposits) +
                                //   parseFloat(results.totalInterest);
                                // const percent = ((value / total) * 100).toFixed(
                                //   2
                                // ); // Calculate percentage
                                return `${value}$`; // Return percentage string
                              }}
                            >
                              {COLORS.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </Grid> */
}

{
  /* <Grid item xs={12} sm={8}>
          {results && (
            <Box>
              <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ color: "#4caf50" }}
                  >
                    Results
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#388e3c" }}>
                    Future Value: ${results.futureValue}
                  </Typography>
                  <Typography>
                    Total Deposits: ${results.totalDeposits}
                  </Typography>
                  <Typography>
                    Total Interest: ${results.totalInterest}
                  </Typography>

                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={results?.chartData}>
                          <XAxis dataKey="period" />
                          <YAxis tickFormatter={(value) => `$${value}`} />
                          <Tooltip formatter={(value) => `$${value}`} />
                          <Legend />
                          <Bar
                            dataKey="endBalance"
                            stackId="a"
                            fill="#1976D2"
                          />
                          <Bar dataKey="deposit" stackId="a" fill="#388E3C" />
                          <Bar dataKey="interest" stackId="a" fill="#DF2528" />
                         
                        </BarChart>
                      </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ResponsiveContainer width={"100%"} height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Starting Amount",
                                value: parseFloat(startingAmount),
                              },
                              {
                                name: "Deposits",
                                value: parseFloat(results.totalDeposits),
                              },
                              {
                                name: "Interest",
                                value: parseFloat(results.totalInterest),
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                            label={({ value }) => {
                              const total =
                                parseFloat(startingAmount) +
                                parseFloat(results.totalDeposits) +
                                parseFloat(results.totalInterest);
                              const percent = ((value / total) * 100).toFixed(
                                2
                              ); // Calculate percentage
                              return `${percent}%`; // Return percentage string
                            }}
                          >
                            {COLORS.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </Grid> */
}

{
  /* <Card sx={{ mt: 2, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ color: "#4caf50" }}>
            Detailed Breakdown
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      padding: "16px 12px",
                    }}
                  >
                    Period
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      padding: "16px 12px",
                    }}
                  >
                    Starting Balance
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      padding: "16px 12px",
                    }}
                  >
                    Deposit
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      padding: "16px 12px",
                    }}
                  >
                    Interest
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      padding: "16px 12px",
                    }}
                  >
                    Ending Balance
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results?.chartData &&
                  Array.isArray(results?.chartData) &&
                  results?.chartData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
                        "&:nth-of-type(even)": { backgroundColor: "#ffffff" },
                        "&:hover": { backgroundColor: "#e3f2fd" },
                      }}
                    >
                      <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
                        {row.period}
                      </TableCell>
                      <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
                        ${row.startBalance.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
                        ${row.deposit.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
                        ${row.interest.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ padding: "16px 12px", color: "#333" }}>
                        ${row.endBalance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card> */
}
// const generatePDF = async () => {
//   setDwnldBtnDisplay(!dwnldBtnDisplay);

//   await new Promise((resolve) => setTimeout(resolve, 100));

//   if (fullPageRef.current) {
//     const pdf = new jsPDF({
//       orientation: "landscape", // Landscape mode
//       // compress: true,
//     });

//     const page = fullPageRef.current;

//     // Capture the full page content
//     const canvas = await html2canvas(page, {
//       scale: 2, // Increase scale for better quality
//       useCORS: true, // Allow cross-origin images if applicable
//     });

//     const imgData = canvas.toDataURL("image/jpeg");
//     const imgWidth = pdf.internal.pageSize.getWidth(); // Use full width of the PDF page
//     const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

//     let heightLeft = imgHeight;
//     let position = 0;

//     // Define the bottom margin in mm (5px = 1.41mm)
//     const bottomMargin = 2.41; // 5px converted to mm

//     // Add the first page
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, "FAST");
//     heightLeft -= pdf.internal.pageSize.getHeight() - bottomMargin; // Adjust height left for bottom margin

//     // Add pages if content overflows
//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight; // Calculate position for the next page
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pdf.internal.pageSize.getHeight() - bottomMargin; // Adjust height left for bottom margin
//     }

//     // Save the PDF
//     pdf.save("full_page.pdf");
//   }
// };
// alert(client_id);

// const calculateFutureValue = () => {
//   const data = [];
//   const rate = parseFloat(interestRate) / 100; // Annual rate in decimal
//   let totalDeposits = 0;
//   let totalInterest = 0;
//   let balance = parseFloat(startingAmount); // Initial amount

//   for (let i = 1; i <= periods; i++) {
//     const startBalance = balance;

//     // Add deposit at the beginning of the period
//     if (compounding === "beginning") {
//       balance += parseFloat(deposit);
//       totalDeposits += parseFloat(deposit);
//     }

//     // Calculate interest for the current period
//     const interest = balance * rate;
//     totalInterest += interest;

//     // Add interest to balance
//     balance += interest;

//     // Add deposit at the end of the period
//     if (compounding === "end") {
//       balance += parseFloat(deposit);
//       totalDeposits += parseFloat(deposit);
//     }

//     // Collect data for accumulated chart
//     data.push({
//       period: i,
//       startBalance: startBalance, // Starting balance of the period
//       deposit: compounding === "beginning" ? parseFloat(deposit) : 0,
//       interest: interest, // Interest earned for this period
//       endBalance: balance, // Ending balance for the period
//       totalDeposits: totalDeposits, // Cumulative deposits
//       totalInterest: totalInterest, // Cumulative interest
//     });
//   }

//   // Update results state
//   setResults({
//     futureValue: balance.toFixed(2),
//     totalDeposits: totalDeposits.toFixed(2),
//     totalInterest: totalInterest.toFixed(2),
//     chartData: data, // Data for the chart
//   });
// };
// const calculateFutureValue = () => {
//   const data = [];
//   const rate = parseFloat(interestRate) / 100; // Annual rate in decimal
//   let totalDeposits = 0;
//   let totalInterest = 0;

//   let balance = parseFloat(startingAmount); // Initial amount
//   for (let i = 1; i <= periods; i++) {
//     // Store the starting balance before any operations
//     const startBalance = balance;

//     // Add deposit at the beginning of the period
//     if (compounding === "beginning") {
//       balance += parseFloat(deposit);
//       totalDeposits += parseFloat(deposit);
//     }

//     // Calculate interest for the current period
//     const interest = balance * rate;
//     totalInterest += interest;

//     // Add interest to balance
//     balance += interest;

//     // Add deposit at the end of the period
//     if (compounding === "end") {
//       balance += parseFloat(deposit);
//       totalDeposits += parseFloat(deposit);
//     }

//     // Collect data for charting
//     data.push({
//       period: i,
//       startBalance: startBalance, // Store starting balance for this period
//       deposit: compounding === "beginning" ? parseFloat(deposit) : 0, // Show deposit for beginning
//       interest: interest,
//       endBalance: balance, // Store ending balance for this period
//     });
//   }

//   // Update results state
//   setResults({
//     futureValue: balance.toFixed(2),
//     totalDeposits: totalDeposits.toFixed(2),
//     totalInterest: totalInterest.toFixed(2),
//     chartData: data,
//   });
// };

{
  /* <Typography
          variant="h6"
          mb={2}
          ml={3}
          mt={3}
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Tax Planning Pays off!
        </Typography> */
}

{
  /* <Grid ml={2} item xs={12} sm={12}>
          {results && (
            <Box>
              <Grid sx={{ boxShadow: 0, borderRadius: 3 }}>
                <Box>
                  {loading ? (
                    "Loadingg.."
                  ) : (
                    <Grid className="flex" container spacing={2}>
                

                      <Grid
                        borderRadius={3}
                        bgcolor={"white"}
                        item
                        xs={12}
                        sm={12}
                      >
                        <Box
                          sx={{
                            padding: 3,
                          }}
                        >
                          <ResponsiveContainer width="100%" height={600}>
                            <BarChart data={results?.chartData}>
                              <XAxis
                                dataKey="period"
                                tick={{ fill: "#666", fontSize: 12 }}
                              />
                              <YAxis
                                tickFormatter={(value) =>
                                  `$${formatToK(value)}`
                                }
                                tick={{ fill: "#666", fontSize: 12 }}
                              />
                              <Tooltip
                                formatter={(value) => `$${value}`}
                                cursor={{ fill: "transparent" }}
                              />
                              <Legend wrapperStyle={{ paddingTop: 20 }} />

                              <Bar
                                dataKey="startBalance"
                                stackId="a"
                                fill="#14B5F0"
                                name="Starting Amount"
                                barSize={40}
                              />
                              <Bar
                                dataKey="totalDeposits"
                                stackId="a"
                                fill="#rgb(67,67,67)"
                                name="Deposits"
                                barSize={40}
                              />
                              <Bar
                                dataKey="totalInterest"
                                stackId="a"
                                fill="#DFCF6A"
                                name="Interest"
                                barSize={40}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Grid>

                      <Typography
                        variant="h6"
                        mb={2}
                        mt={8}
                        sx={{ fontWeight: "bold" }}
                      >
                        Strategy Savings Breakdown
                      </Typography>
                      <Grid
                        width={"100%"}
                        bgcolor={"#fff"}
                        container
                        p={2}
                        borderRadius={3}
                      >
                        <Grid item xs={12} lg={dwnldBtnDisplay ? 6 : 12}>
                          <Box>
                            <div style={{ breakBefore: "page" }}>
                              <ResponsiveContainer width="100%" height={500}>
                                <PieChart>
                                  <Pie
                                    data={strategiesAggregatedDataForPieChart}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    labelLine={true}
                                    label={renderCustomLabel}
                                    paddingAngle={1}
                                    stroke="#e0e0e0"
                                  >
                                    {strategiesAggregatedDataForPieChart.map(
                                      (entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={COLORS[index % COLORS.length]}
                                        />
                                      )
                                    )}
                                  </Pie>
                                  <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                              <CustomLegendPieChart items={legendItems} />
                            </div>
                          </Box>
                        </Grid>
                        <Grid item xs={12} lg={dwnldBtnDisplay ? 6 : 12}>
                          <Box sx={{ p: 3 }}>
                            <Typography
                              variant="h5"
                              gutterBottom
                              align="center"
                            >
                              Strategy Overview
                            </Typography>
                            <Box
                              sx={{
                                maxHeight: dwnldBtnDisplay ? 400 : "",
                                overflowY: dwnldBtnDisplay ? "scroll" : "",
                              }}
                            >
                              <TableContainer component={Paper}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        Strategy Name
                                      </TableCell>
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        Associated For
                                      </TableCell>
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        Total Savings
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {startegyList.map((strategy, index) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          {strategy.strategyName}
                                        </TableCell>
                                        <TableCell>
                                          {strategy.associatedWith}
                                        </TableCell>
                                        <TableCell>
                                          $
                                          {calculateTotalSavings(
                                            strategy.federalTaxSavings,
                                            strategy.stateTaxSavings
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Grid>
            </Box>
          )}
        </Grid> */
}




      {/* <Box mt={8}></Box>

      <Typography variant="h4" mb={2} sx={{ fontWeight: "bold" }}>
        Tax savings by the end of this year
      </Typography> */}

      {/* <Button onClick={handleOpen} variant="contained" color="primary">
        PDF REPORT
      </Button>

      <div className="w-full mt-2 gap-x-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
          <h5 className="text-[17px] font-medium ">Federal Tax Savings</h5>
          <h5 className="text-3xl font-semibold ">
            {formatToK(startingAmount)}
          </h5>
        </div>
        <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
          <h5 className="text-[17px] font-medium">State Tax Savings</h5>
          <h5 className="text-3xl font-semibold">
            {formatToK(stateTaxSavings)}
          </h5>
        </div>

        <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
          <h5 className="text-[17px] font-medium">
            Number of Strategies(Business)
          </h5>
          <h5 className="text-3xl font-semibold">{noOfBusinessStrategies}</h5>
        </div>
        <div className="col-span-1 mb-4 p-5 bg-white rounded-lg">
          <h5 className="text-[17px] font-medium">
            Number of Strategies(Indvidual)
          </h5>
          <h5 className="text-3xl font-semibold">{noOfIndividualStrategies}</h5>
        </div>
      </div> */}