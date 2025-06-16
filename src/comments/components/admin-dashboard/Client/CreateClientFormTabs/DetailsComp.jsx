import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, Typography, MenuItem, Switch } from "@mui/material";
import CustomTextField from "@/mui/CustomTextField"; // Assume this is a styled component
import { useEffect } from "react";
import { Grid3x3 } from "@mui/icons-material";
import toast from "react-hot-toast";




const initialClientData = {
  clientName: "", // Required field
  partner: "", // Required field
  manager: "", // Required field
  financialYearEnd: "", // Required field
  fiscalEndDate: "", // Required field
  age:0,
  tags: "", // Optional field
  notes: "", // Optional field
  contactName: "", // Required field
  contactEmail: "", // Required field
  addressee: "", // Required field
  mobile: "", // Required field
  phone: "", // Optional field
  email: "",
  password: "",
};

const ClientDetailsForm = ({
  mode,
  onUpdate,
  setValidationStatus,
  initialValues,
  handleTabChange,
}) => {

  const clientSchema = mode  === 'edit' ?  clientSchemaForEdit  :clientSchemaForCreate
console.log(initialValues, 'clientSchema')
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (data) => {
    if (isValid) {
      handleTabChange("Company");
    }
    // console.log(data);
  };
  useEffect(() => {
    console.log("initial data ", initialValues);
    // handleTabChange('Company')
    // setTimeout(()=>{
    //   handleTabChange('Details')
    // },60)
  }, []);
  const handleChange = (field, value) => {
    setValue(field, value);
    // console.log("jhgjhgj");
    if (isValid) {
      setValidationStatus(true);
      console.log("you form is valid.....");
    }

    onUpdate({ ...getValues(), [field]: value }); // Update the parent with all current values
  };
  const ggg = getValues()
console.log(watch('questionnaireSent'),ggg )
  return (
    <Box backgroundColor={"white"} padding={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Client Details</span>
        </div>

        <Box paddingTop={2}>
          <CustomTextField
            label="Client name"
            className="w-full"
            error={!!errors.clientName}
            helperText={errors.clientName?.message}
            {...register("clientName", {
              onChange: (e) => handleChange("clientName", e.target.value),
            })}
          />

          <Grid
            container
            spacing={2}
            marginTop={1}
            className="mt-5 items-center"
          >
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Partner"
                className="w-full"
                error={!!errors.partner}
                helperText={errors.partner?.message}
                {...register("partner", {
                  onChange: (e) => handleChange("partner", e.target.value),
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Manager"
                className="w-full"
                // select
                error={!!errors.manager}
                value={getValues("manager")}
                helperText={errors.manager?.message}
                {...register("manager", {
                  onChange: (e) => handleChange("manager", e.target.value),
                })}
              >
                <MenuItem value="one_time">One Time</MenuItem>
                <MenuItem value="recurring">Recurring</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>

          <Grid container alignItems={"center"} spacing={2} marginTop={2}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Financial Year End"
                className="w-full"
                type='date'
                // select
                error={!!errors.financialYearEnd}
                value={getValues("financialYearEnd")}
                helperText={errors.financialYearEnd?.message}
                {...register("financialYearEnd", {
                  onChange: (e) =>
                    handleChange("financialYearEnd", e.target.value),
                })}
              >
                <MenuItem value="one_time">One Time</MenuItem>
                <MenuItem value="recurring">Recurring</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Annual Fiscal or reporting period end date"
                className="w-full"
                type='date'

                // select
                value={getValues("fiscalEndDate")}
                error={!!errors.fiscalEndDate}
                helperText={errors.fiscalEndDate?.message}
                {...register("fiscalEndDate", {
                  onChange: (e) =>
                    handleChange("fiscalEndDate", e.target.value),
                })}
              >
                <MenuItem value="one_time">One Time</MenuItem>
                <MenuItem value="recurring">Recurring</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>

          <Grid
            alignItems={"center"}
            className="mt-4"
            container
            gap={0}
            spacing={2}
            marginTop={2}
          >
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Tags"
                {...register("tags", {
                  onChange: (e) => handleChange("tags", e.target.value),
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Status"
                select
                className="w-full"
                value={getValues("status")}
                error={!!errors.status}
                helperText={errors.status?.message}
                {...register("status", {
                  onChange: (e) => handleChange("status", e.target.value),
                })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="lead">Lead</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
                <MenuItem value="inactive">In Active</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>

          <Box className="mt-4">
            <CustomTextField
              label="Notes"
              rows={6}
              className="w-full"
              {...register("notes", {
                onChange: (e) => handleChange("notes", e.target.value),
              })}
            />
          </Box>

          <Typography marginTop={3} variant={"h6"}>
            Contacts
          </Typography>

          <Grid container spacing={2} alignItems={"center"} marginTop={2}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Contact Name"
                fullWidth
                error={!!errors.contactName}
                helperText={errors.contactName?.message}
                {...register("contactName", {
                  onChange: (e) => handleChange("contactName", e.target.value),
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Contact Email"
                fullWidth
                error={!!errors.contactEmail}
                helperText={errors.contactEmail?.message}
                {...register("contactEmail", {
                  onChange: (e) => handleChange("contactEmail", e.target.value),
                })}
              />
            </Grid>
          </Grid>

          <CustomTextField
            label="Address"
            className="w-full mt-3"
            error={!!errors.addressee}
            helperText={errors.addressee?.message}
            {...register("addressee", {
              onChange: (e) => handleChange("addressee", e.target.value),
            })}
          />

          <Grid container alignItems={"center"} spacing={2} marginTop={2}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Mobile"
                type="number"
                fullWidth
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                {...register("mobile", {
                  onChange: (e) => handleChange("mobile", e.target.value),
                })}
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Phone"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...register("phone", {
                  onChange: (e) => handleChange("phone", e.target.value),
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Age"
                type="number"
                fullWidth
                error={!!errors?.age}
                helperText={errors?.age?.message}
                {...register("age", {
                  onChange: (e) => handleChange("age", e.target.value),
                })}
              />
            </Grid>

            
            {/* {mode  !== 'edit' && <Grid item xs={12} md={6}>
              <p>Want to send questionnaire to this client?</p>
              <Switch 
              checked={watch('questionnaireSent')}
                {...register("questionnaireSent", {
                  onChange: (e) => handleChange("questionnaireSent", e.target.checked),
                })} 
                />
            </Grid>} */}




            
          </Grid>

       
{
mode==='create' &&
<>
<Typography variant="h6" mt={6}>
  Credentials
</Typography>
<Grid container alignItems={"center"} spacing={2} marginTop={2}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", {
                  onChange: (e) => handleChange("email", e.target.value),
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Password"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", {
                  onChange: (e) => handleChange("password", e.target.value),
                })}
              />
            </Grid>
          </Grid>
</>

}

          {/* <Box marginTop={2}>
            <button
              onClick={() => {}}
              type="button"
              className="flex px-8 items-center justify-center bg-[#0074BD] text-white py-2 rounded-md text-nowrap"
            >
              + Add another contact
            </button>
          </Box> */}

          <Box display={"flex"} justifyContent={"end"} marginTop={2}>
            <button
              onClick={() => {
                if (isValid) {
                  toast.success("Saved , fill the next!", {
                    position: "top-right",
                    duration: 3000, // Auto close after 3 seconds
                  });
                } else {
                  toast.error("Complete the Form!", {
                    position: "top-right",
                    duration: 3000, // Auto close after 3 seconds
                  });
                }
              }}
              className="flex px-8 items-center justify-center bg-[#0074BD] text-white py-2 rounded-md text-nowrap"
            >
              Next
            </button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default ClientDetailsForm;

const clientSchemaForEdit = z.object({
  clientName: z.string().min(1, "Client name is required"),
  partner: z.string().min(1, "Partner is required"),
  manager: z.string().min(1, "Manager is required"),
 
  financialYearEnd: z.string().min(1, "Financial Year End is required"),
  fiscalEndDate: z.string().min(1, "Fiscal End Date is required"), 
 
  // financialYearEnd: z.date({ required_error: "Financial Year End is required" }),
  // fiscalEndDate: z.date({ required_error: "Fiscal End Date is required" }),

  status: z.string().min(1, "Status is required"),
  tags: z.string().optional(),
  age:z
  .preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number()
  )
  .refine((val) => !isNaN(val), { message: "Expected number" }),
    notes: z.string().optional(),
  contactName: z.string().min(1, "Contact Name is required"),
  contactEmail: z.string().email("Invalid email"),
  addressee: z.string().min(1, "Address is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  phone: z.string().min(1, "Phone number is required"),
  questionnaireSent: z.boolean().optional(),
});

const clientSchemaForCreate = z.object({
  clientName: z.string().min(1, "Client name is required"),
  partner: z.string().min(1, "Partner is required"),
  manager: z.string().min(1, "Manager is required"),
 
  financialYearEnd: z.string().min(1, "Financial Year End is required"),
  fiscalEndDate: z.string().min(1, "Fiscal End Date is required"), 
 
  // financialYearEnd: z.date({ required_error: "Financial Year End is required" }),
  // fiscalEndDate: z.date({ required_error: "Fiscal End Date is required" }),

  status: z.string().min(1, "Status is required"),
  tags: z.string().optional(),
  notes: z.string().optional(),
  age:z
  .preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number()
  )
  .refine((val) => !isNaN(val), { message: "Expected number" }),
  contactName: z.string().min(1, "Contact Name is required"),
  contactEmail: z.string().email("Invalid email"),
  addressee: z.string().min(1, "Addressee is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  phone: z.string().min(1, "Phone number is required"),

  email: z.string().email("Email is Required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

