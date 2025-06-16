import React, { useEffect, useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import SimpleTable from "../../SimpleTable";
import { v4 as uuidv4 } from "uuid";
import { Box, IconButton, MenuItem, Modal } from "@mui/material";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomTextField from "../../../mui/CustomTextField";
import CustomSecondaryButton from "../../../mui/CustomSecondaryButton";
import RoundedButton from "../../../mui/RoundedButton";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useDispatch, useSelector } from "react-redux";
import {
  addCashflowInTaxPlan,
  addTaxPlan,
  selectStrategiesInPlan,
  selectTaxPlansArray,
} from "../../../redux/taxplan";
import { useParams } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

// Zod Schema for Modal Start
const schema = z.object({
  id: z.string(),
  type: z.string().min(1, "Type is required"),
  strategy: z.string().min(1, "Strategy is required"),
  amount: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().optional()
  ),
  transaction_type: z.string().min(1, "Transaction type is required"),
  third_party: z.string().optional(),
  frequency: z.string().optional(),
  payment_date: z.string().min(1, "Payment date is required"),
  description: z.string().min(1, "Description is required"),
});
// Zod Schema for Modal End

const columns = [
  { field: "type", headerName: "Type" },
  { field: "strategy", headerName: "Strategy" },
  { field: "description", headerName: "Description" },
  { field: "amount", headerName: "Amount" },
  { field: "transaction_type", headerName: "Transaction type" },
  { field: "third_party", headerName: "Third party" },
  { field: "frequency", headerName: "Frequency" },
  { field: "payment_date", headerName: "Payment date" },
  { field: "actions", headerName: "Actions" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "#fff",
  boxShadow: 24,
  p: 2,
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  maxHeight: "80%",
};

const CashflowTableDetailNStrategy = () => {
  // router stuff
  const { tax_plan_id } = useParams();
  // redux stuff
  const dispatch = useDispatch();
  const allTaxPlans = useSelector(selectTaxPlansArray);
  const allStrategiesofCurrentTaxPlan = useSelector(
    selectStrategiesInPlan
  ).filter((strategy) => strategy.tax_plan_id === tax_plan_id);

  console.log(
    "!!>><<>>>>All strategies in taxPlan",
    allStrategiesofCurrentTaxPlan
  );

  // local states
  const [cashflowArray, setcashflowArray] = useState([]);
  const [currentTaxPlan, setCurrentTaxPlan] = useState(null);
  const [currentCashFlow, setcurrentCashFlow] = useState(null);
  //Modal States Start
  const [addCashflowModalOpen, setaddCashflowModalOpen] = useState(false);
  const handleaddCashflowModalOpen = () => setaddCashflowModalOpen(true);
  const handleaddCashflowModalClose = () => setaddCashflowModalOpen(false);
  //Modal States End

  // Form Start
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: uuidv4(),
      type: "",
      strategy: "",
      amount: 0,
      transaction_type: "",
      third_party: "",
      frequency: "",
      payment_date: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    if (data.frequency === undefined) {
      data.frequency = "";
    }
    if (data.rate === undefined) {
      data.rate = "";
    }
    if (data.amount === undefined) {
      data.amount = 0;
    }
    dispatch(addCashflowInTaxPlan({ id: tax_plan_id, data }));
    reset({
      id: uuidv4(),
      type: "",
      strategy: "",
      amount: 0,
      transaction_type: "",
      third_party: "",
      frequency: "",
      payment_date: "",
      description: "",
    });
    setcurrentCashFlow(null);
    handleaddCashflowModalClose();
  };

  const typeSelected = watch("type");
  // resetting the fields
  useEffect(() => {
    if (typeSelected !== "recurring") {
      setValue("frequency", "");
    }
  }, [typeSelected]);
  // Form End

  // updating data in table
  useEffect(() => {
    console.log(allTaxPlans);
    let currentTaxPlan = allTaxPlans.find(
      (taxPlan) => taxPlan.id === tax_plan_id
    );
    setCurrentTaxPlan(currentTaxPlan);
    if (currentTaxPlan && currentTaxPlan.cashflows) {
      setcashflowArray(
        currentTaxPlan.cashflows.map((cashflow) => ({
          ...cashflow,
          actions: cashflow.id,
        }))
      );
    }
  }, [allTaxPlans]);

  // Form resetting
  useEffect(() => {
    if (currentCashFlow) {
      reset(currentCashFlow);
    }
  }, [currentCashFlow]);
  useEffect(() => {
    if (addCashflowModalOpen) return;
    setcurrentCashFlow(null);
    reset({
      id: uuidv4(),
      type: "",
      strategy: "",
      amount: 0,
      transaction_type: "",
      third_party: "",
      frequency: "",
      payment_date: "",
      description: "",
    });
  }, [addCashflowModalOpen]);

  // Helper functions and data structures
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear + i);

  // Table Custom Components
  const editCashflow = (id) => {
    handleaddCashflowModalOpen();
    const targetCashflow = cashflowArray.find((cashflow) => cashflow.id === id);
    setcurrentCashFlow(targetCashflow);
  };
  const deleteCashflow = (id) => {
    const wantsToDelete = confirm("Are you sure want to delete this cashflow?");
    if (!wantsToDelete) return;
    let newcashflowArray = cashflowArray.filter(
      (cashflow) => cashflow.id !== id
    );
    let newTaxPlan = { ...currentTaxPlan, cashflows: newcashflowArray };
    dispatch(addTaxPlan(newTaxPlan));
  };

  const CustomActionCell = ({ value }) => {
    return (
      <div className="flex items-center">
        <IconButton size="small" onClick={() => editCashflow(value)}>
          <Edit />
        </IconButton>
        <IconButton size="small" onClick={() => deleteCashflow(value)}>
          <Delete />
        </IconButton>
      </div>
    );
  };

  const cellComponents = {
    actions: CustomActionCell,
  };

  return (
    <>
      <Modal
        open={addCashflowModalOpen}
        onClose={handleaddCashflowModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={{ ...style, overflowY: "auto" }}>
          <h4 className="text-[24px] font-medium pb-4">Add Cashflow</h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-y-3 pt-4 border-t border-black/20"
          >
            <div className="flex items-center flex-col md:flex-row w-full gap-3">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Type"
                    placeholder="Type"
                    className="w-full md:w-1/2"
                    error={!!errors.type}
                    helperText={errors.type ? errors.type.message : ""}
                    select
                  >
                    <MenuItem value={"one_time"}>One Time</MenuItem>
                    <MenuItem value={"recurring"}>Recurring</MenuItem>
                  </CustomTextField>
                )}
              />
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    type="number"
                    label="Amount"
                    placeholder="Amount"
                    className="w-full md:w-1/2"
                    error={!!errors.amount}
                    helperText={errors.amount ? errors.amount.message : ""}
                    startAdornment={<AttachMoneyIcon />}
                  />
                )}
              />
            </div>
            <div className="flex items-center flex-col md:flex-row w-full gap-3">
              <Controller
                name="strategy"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="strategy"
                    placeholder="strategy"
                    className="w-full md:w-1/2"
                    error={!!errors.strategy}
                    helperText={errors.strategy ? errors.strategy.message : ""}
                    select
                  >
                    {allStrategiesofCurrentTaxPlan.map((strategy, index) => {
                      return (
                        <MenuItem key={strategy.id} value={strategy.id}>
                          {strategy.strategy}
                        </MenuItem>
                      );
                    })}
                  </CustomTextField>
                )}
              />
              <Controller
                // disabled={typeSelected !== "recurring"}
                name="transaction_type"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Transaction type"
                    placeholder="Transaction type"
                    className="w-full md:w-1/2"
                    error={!!errors.transaction_type}
                    helperText={
                      errors.transaction_type
                        ? errors.transaction_type.message
                        : ""
                    }
                    select
                  >
                    <MenuItem value={"sender"}>Sender</MenuItem>
                    <MenuItem value={"receiver"}>Receiver</MenuItem>
                  </CustomTextField>
                )}
              />
            </div>
            <div className="flex items-center flex-col md:flex-row w-full gap-3">
              <Controller
                name="third_party"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Third party"
                    placeholder="Year"
                    className="w-full md:w-1/2"
                    error={!!errors.third_party}
                    helperText={
                      errors.third_party ? errors.third_party.message : ""
                    }
                    select
                  >
                    <MenuItem value={"sample_thirdparty01"}>
                      third party 01
                    </MenuItem>
                    <MenuItem value={"sample_thirdparty02"}>
                      third party 02
                    </MenuItem>
                  </CustomTextField>
                )}
              />
              <Controller
                disabled={typeSelected !== "recurring"}
                name="frequency"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Frequency"
                    placeholder="Transaction type"
                    className="w-full md:w-1/2"
                    error={!!errors.frequency}
                    helperText={
                      errors.frequency ? errors.frequency.message : ""
                    }
                    select
                  >
                    <MenuItem value={"monthly"}>Monthly</MenuItem>
                    <MenuItem value={"yearly"}>Yearly</MenuItem>
                  </CustomTextField>
                )}
              />
            </div>
            <Controller
              name="payment_date"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="Payment date"
                  placeholder="Payment date"
                  className="w-full md:w-1/2"
                  error={!!errors.payment_date}
                  helperText={
                    errors.payment_date ? errors.payment_date.message : ""
                  }
                  type="date"
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="Description"
                  multiline
                  rows={4}
                  placeholder="Description"
                  className="w-full"
                  error={!!errors.description}
                  helperText={
                    errors.description ? errors.description.message : ""
                  }
                />
              )}
            />
            <Box className="w-full flex flex-col md:flex-row items-center justify-end mt-4 gap-2">
              <CustomSecondaryButton
                type="button"
                className="rounded-lg w-full md:w-auto bg-transparent px-8 py-2"
                onClick={() => handleaddCashflowModalClose()}
              >
                Cancel
              </CustomSecondaryButton>
              <RoundedButton
                type="submit"
                className="rounded-lg w-full md:w-auto bg-[#0074BD] px-8 py-2 text-white"
                onClick={handleSubmit(onSubmit)}
              >
                {currentCashFlow ? "Update Cashflow" : "Add Cashflow"}
              </RoundedButton>
            </Box>
          </form>
        </Box>
      </Modal>
      <div className="flex flex-col gap-y-4 bg-white p-3">
        <div className="text-[#130901] flex flex-col md:flex-row md:items-center justify-between ">
          <h3 className="text-[16px] font-semibold">
            Your investment in The Dotch Capital Corporation:
          </h3>
          <button
            onClick={() => handleaddCashflowModalOpen()}
            className="flex items-center justify-center text-[#0074BD]  p-2 rounded-md text-nowrap"
          >
            <HiOutlinePlusSm />
            Add new cashflow
          </button>
        </div>
        <SimpleTable
          headerStyles={{ bgcolor: "#eee" }}
          columns={columns}
          data={cashflowArray}
          cellComponents={cellComponents}
        />
      </div>
    </>
  );
};

export default CashflowTableDetailNStrategy;
