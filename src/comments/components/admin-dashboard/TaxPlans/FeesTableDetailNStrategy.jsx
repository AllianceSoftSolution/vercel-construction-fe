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
  addFeeInTaxPlan,
  addTaxPlan,
  selectTaxPlansArray,
} from "../../../redux/taxplan";
import { useParams } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

// Zod Schema for Modal Start
const schema = z.object({
  id: z.string(),
  type: z.string().min(1, "Type is required"),
  amount: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().optional()
  ),
  rate: z.string().optional(),
  frequency: z.string().optional(),
  year: z.string().min(1, "Year is required"),
  description: z.string().min(1, "Description is required"),
});
// Zod Schema for Modal End

const columns = [
  { field: "type", headerName: "Investment Type" },
  { field: "description", headerName: "Description" },
  { field: "amount", headerName: "Amount" },
  { field: "rate", headerName: "Rate" },
  { field: "frequency", headerName: "Frequency" },
  { field: "year", headerName: "Year" },
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

const FeesTableDetailNStrategy = () => {
  // router stuff
  const { tax_plan_id } = useParams();
  // redux stuff
  const dispatch = useDispatch();
  const allTaxPlans = useSelector(selectTaxPlansArray);

  // local states
  const [feesArray, setFeesArray] = useState([]);
  const [currentTaxPlan, setCurrentTaxPlan] = useState(null);
  const [currentFee, setCurrentFee] = useState(null);
  //Modal States Start
  const [addFeeModalOpen, setaddFeeModalOpen] = useState(false);
  const handleaddFeeModalOpen = () => setaddFeeModalOpen(true);
  const handleaddFeeModalClose = () => setaddFeeModalOpen(false);
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
      amount: 0,
      rate: "",
      frequency: "",
      year: "",
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
    dispatch(addFeeInTaxPlan({ id: tax_plan_id, data }));
    reset({
      id: uuidv4(),
      type: "",
      amount: 0,
      rate: "",
      frequency: "",
      year: "",
      description: "",
    });
    setCurrentFee(null);
    handleaddFeeModalClose();
  };

  const typeSelected = watch("type");
  // resetting the fields
  useEffect(() => {
    if (typeSelected !== "recurring") {
      setValue("frequency", "");
    }
    if (typeSelected === "priceless") {
      setValue("rate", "");
      setValue("amount", 0);
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
    if (currentTaxPlan && currentTaxPlan.fees) {
      setFeesArray(
        currentTaxPlan.fees.map((fee) => ({ ...fee, actions: fee.id }))
      );
    }
  }, [allTaxPlans]);

  // Form resetting
  useEffect(() => {
    if (currentFee) {
      reset(currentFee);
    }
  }, [currentFee]);
  useEffect(() => {
    if (addFeeModalOpen) return;
    setCurrentFee(null);
    reset({
      id: uuidv4(),
      type: "",
      amount: 0,
      rate: "",
      frequency: "",
      year: "",
      description: "",
    });
  }, [addFeeModalOpen]);

  // Helper functions and data structures
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear + i);

  // Table Custom Components
  const editFee = (id) => {
    handleaddFeeModalOpen();
    const targetFee = feesArray.find((fee) => fee.id === id);
    setCurrentFee(targetFee);
  };
  const deleteFee = (id) => {
    const wantsToDelete = confirm("Are you sure want to delete this fee?");
    if (!wantsToDelete) return;
    let newFeesArray = feesArray.filter((fee) => fee.id !== id);
    let newTaxPlan = { ...currentTaxPlan, fees: newFeesArray };
    dispatch(addTaxPlan(newTaxPlan));
  };

  const CustomActionCell = ({ value }) => {
    return (
      <div className="flex items-center">
        <IconButton size="small" onClick={() => editFee(value)}>
          <Edit />
        </IconButton>
        <IconButton size="small" onClick={() => deleteFee(value)}>
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
        open={addFeeModalOpen}
        onClose={handleaddFeeModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={{ ...style, overflowY: "auto" }}>
          <h4 className="text-[24px] font-medium pb-4">Add fee</h4>
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
                    <MenuItem value={"pre_paid"}>Pre Paid</MenuItem>
                    <MenuItem value={"priceless"}>Priceless</MenuItem>
                    <MenuItem value={"third_party"}>Third Party</MenuItem>
                  </CustomTextField>
                )}
              />
              <Controller
                disabled={typeSelected === "priceless"}
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
                disabled={typeSelected === "priceless"}
                name="rate"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Rate"
                    placeholder="Rate"
                    className="w-full md:w-1/2"
                    error={!!errors.rate}
                    helperText={errors.rate ? errors.rate.message : ""}
                    select
                  >
                    <MenuItem value={"effective_rate"}>Effective Rate</MenuItem>
                    <MenuItem value={"marginal_rate"}>Marginal Rate</MenuItem>
                    <MenuItem value={"cap_gains_rate"}>Cap Gain Rate</MenuItem>
                    <MenuItem value={"c_corp_flat_rate"}>
                      C Corp Flat Rate
                    </MenuItem>
                    <MenuItem value={"non_deductible"}>Non-deductible</MenuItem>
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
                    label="frequency"
                    placeholder="frequency"
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
              name="year"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="Year"
                  placeholder="Year"
                  className="w-full md:w-1/2"
                  error={!!errors.year}
                  helperText={errors.year ? errors.year.message : ""}
                  select
                >
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </CustomTextField>
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
                onClick={() => handleaddFeeModalClose()}
              >
                Cancel
              </CustomSecondaryButton>
              <RoundedButton
                type="submit"
                className="rounded-lg w-full md:w-auto bg-[#0074BD] px-8 py-2 text-white"
                onClick={handleSubmit(onSubmit)}
              >
                {currentFee ? "Update fee" : "Add fee"}
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
            onClick={() => handleaddFeeModalOpen()}
            className="flex items-center justify-center text-[#0074BD]  p-2 rounded-md text-nowrap"
          >
            <HiOutlinePlusSm />
            Add new fee
          </button>
        </div>
        <SimpleTable
          headerStyles={{ bgcolor: "#eee" }}
          columns={columns}
          data={feesArray}
          cellComponents={cellComponents}
        />
      </div>
    </>
  );
};

export default FeesTableDetailNStrategy;
