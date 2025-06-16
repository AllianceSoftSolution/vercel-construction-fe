import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  styled,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleTable from "@/components/SimpleTable";
import CustomTextField from "@/mui/CustomTextField"; // Assume this is a styled component
import AddQuestionModal from "../../../layouts/admin-dashboard/settings/questionnaire/question/AddQuestionModal";
import { Delete, Edit } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { getStatusColor } from "@/utils";
import RichTextEditor from "../../RichTextEditor";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  add_client,
  remove_client,
  edit_client,
  select_clients_array,
  find_client_by_field,
} from "../../../redux/admin_client";
import DetailsComp from "../../../components/admin-dashboard/Client/CreateClientFormTabs/DetailsComp";
import CompanyComp from "../../../components/admin-dashboard/Client/CreateClientFormTabs/CompanyComp";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";

const CreateService = ( {additionalContent}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down(768));
  const [loading, setloading] = useState(false);
  const [singleService, setsingleService] = useState();
  const location = useLocation();
  const serviceEditId = location?.state?.id;
  const [load, setLoad] = useState(false);
  const fetchData = async () => {
    setLoad(true);
    const result = await apiClient.get(`service/${serviceEditId}`);
    if (!result.ok) {
      toast.error("Something went wrong");
      setLoad(false);
      return;
    }
    console.log(result);
    setsingleService(result.data.data);

    setLoad(false);
  };
  useEffect(() => {
    if (serviceEditId) {
      fetchData();
    } else return;
  }, [serviceEditId]);
  const initialState = {
    // priceType: "",
    price: "",
    taxRate: "",
    billingMode: "",
    name: "",
    description: "",
    terms: "",
  };
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: singleService ? singleService : initialState,
  });
  // Update form values when singleService is fetched
  useEffect(() => {
    if (singleService) {
      reset(singleService); // Once the data is fetched, update the form with singleService values
    }
  }, [singleService, reset]);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    setloading(true);
    let result;
    if (singleService) {
      result = await apiClient.put(`service/${serviceEditId}`, data);
    } else {
      result = await apiClient.post(`service`, data);
    }
    if (!result.ok) {
      toast.error("Something went wrong");
      setloading(false);
      return;
    }
    toast.success(
      singleService
        ? "Service Modified Successfully"
        : "Service Created Successfully"
    );

    setloading(false);
    navigate(-1);
  };

  const handleSelect = (option) => {
    console.log("Selected:", option);
  };
  console.log(errors);
  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "#BFC6D4" }}>
        <div className="flex justify-between mb-2 items-center">
          <div>
            {/* <span className="text-2xl font-bold">Service{"> "}</span>
              <span className="text-2xl text-light">
                3% Doctor of Dental Surgery Tax Status Annual Program
              </span> */}
            <span className="text-2xl font-bold">Create New Service</span>
          </div>
          {/* <div className="flex gap-3">
              <Dropdown
                options={["Active", "Archived", "Lead"]}
                defaultLabel="More Action"
                onSelect={handleSelect}
              />
              <button
                className="inline-flex justify-between rounded-md border bg-[#BDBDBD80] border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:ring-indigo-500"
                type="button"
              >
                <span className="font-bold">Save</span>
              </button>
            </div> */}
        </div>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: "-2px" }} />
      </Box>

      {!load ? (
        <Box sx={{ marginTop: 2, backgroundColor: "white", paddingTop: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} backgroundColor={"white"} padding={3}>
              <Grid
                item
                md={8}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                xs={12}
              >
                {/* Service Name */}
                <CustomTextField
                  label="Service Name"
                  className="w-full"
                  placeholder="3% Doctor of Dental Surgery Tax Status Annual Program"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register("name")}
                />

                {/* Service Description */}
                <Box>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography>Service Description</Typography>
                    {/* <Typography color={"primary"}>Suggest Description</Typography> */}
                  </Box>
                  <Typography color={"gray"} marginTop={1}>
                    Set the scope of the service. Explain what you’ll do,
                    inclusions, exclusions, and software used.
                  </Typography>
                </Box>

                <RichTextEditor
                  rows={9}
                  editorContent={getValues("description")}
                  handleChange={(value) => setValue("description", value)}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}

                {/* <RichTextEditor
                rows={9}
                  editorContent={getValues("serviceDescription")}
                  error={!!errors.serviceDescription}
                  helperText={errors.serviceDescription?.message}
                  handleChange={(value) => setValue("serviceDescription", value)}
                /> */}

                {/* Service Terms */}
                <Box>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography>Service Terms</Typography>
                  </Box>
                  <Typography color={"gray"} marginTop={1}>
                    Add optional, additional terms to the proposal terms when
                    you include this service in a proposal.
                  </Typography>
                </Box>
                {/* <RichTextEditor
                rows={9}
                  editorContent={getValues("serviceTerms")}
                  error={!!errors.serviceTerms}
                  helperText={errors.serviceTerms?.message}
                  handleChange={(value) => setValue("serviceTerms", value)}
                /> */}

                <RichTextEditor
                  rows={9}
                  editorContent={getValues("terms")}
                  handleChange={(value) => setValue("terms", value)}
                />
                {errors.terms && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.terms.message}
                  </p>
                )}

                {/* Next Button */}
              </Grid>

              <Grid item md={4} xs={12}>
                {/* Price Type */}
                {/* <CustomTextField
                label="Price Type"
                select
                className="w-full"
                error={!!errors.priceType}
                helperText={errors.priceType?.message}
                {...register("priceType")}
              >
                <MenuItem value="fixed">Fixed</MenuItem>
                <MenuItem value="unit price">Unit Price</MenuItem>
                <MenuItem value="minium price">Minium Price</MenuItem>
                <MenuItem value="price range">Price Range</MenuItem>
                <MenuItem value="included">Included</MenuItem>
              </CustomTextField> */}

                {/* Price */}
                <CustomTextField
                  label="Price (excl. tax)"
                  className="w-full mt-3 md:mt-0"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  {...register("price")}
                  type="number"
                />

                {/* Tax Rate */}
                <CustomTextField
                  label="Tax Rate"
                  select
                  value={watch("taxRate")}
                  className="w-full mt-3"
                  error={!!errors.taxRate}
                  helperText={errors.taxRate?.message}
                  {...register("taxRate")}
                >
                  <MenuItem value="exempt">Exempt (0.00%)</MenuItem>
                </CustomTextField>

                {/* Billing Mode */}
                <CustomTextField
                  label="Billing Mode"
                  select
                  value={watch("billingMode")}
                  className="w-full mt-3"
                  error={!!errors.billingMode}
                  helperText={errors.billingMode?.message}
                  {...register("billingMode")}
                >
                  <MenuItem value="automatic">Automatic</MenuItem>
                  <MenuItem value="manual">Manual</MenuItem>
                </CustomTextField>
                <Box paddingTop={2}>
                  <Box display={"flex"} justifyContent={"end"} marginTop={2}>
                    <button
                      type="submit"
                      className="flex px-8 items-center justify-center bg-[#0074BD] text-white py-2 rounded-md text-nowrap"
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress
                          size={24}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </Box>
                </Box>
                {additionalContent && <Box mt={3}>{additionalContent}</Box>}
              </Grid>
            </Grid>
          </form>
        </Box>
      ) : (
        <div className="flex justify-center items-center p-5">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

// Zod validation schema
const clientSchema = z.object({
  name: z.string().min(1, "Service Name is required"),
  description: z
    .string()
    .min(1, "Service description is required")
    .max(5000, "Service description is too long"),
  terms: z
    .string()
    .min(1, "Service Terms are required")
    .max(5000, "Service Terms are too long"),
  // priceType: z.enum(["fixed", "unit price", "minimum price", "price range", "included"], {
  //   errorMap: () => ({ message: "Price Type is required" }),
  // }),
  price: z.union([z.string(), z.number()]).refine((value) => {
    return typeof value === "string" ? value.trim().length > 0 : value > 0;
  }, "Price is required"),

  taxRate: z.enum(["exempt"], {
    errorMap: () => ({ message: "Tax Rate is required" }),
  }),
  billingMode: z.enum(["automatic", "manual"], {
    errorMap: () => ({ message: "Billing Mode is required" }),
  }),
});

const Dropdown = ({ options, defaultLabel = "Status", onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultLabel);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          className="inline-flex justify-between w-full rounded-md border bg-[#BDBDBD80] border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:ring-indigo-500"
          type="button"
          onClick={toggleDropdown}
        >
          <span className="font-bold">{selectedOption}</span>

          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06 0L10 10.64l3.71-3.43a.75.75 0 111.04 1.08l-4.25 3.9a.75.75 0 01-1.04 0l-4.25-3.9a.75.75 0 010-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-[100%] rounded-md shadow-lg bg-[#BDBDBD80] ring-1 ring-black ring-opacity-5">
          <ul
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option, index) => (
              <li key={index}>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateService;
