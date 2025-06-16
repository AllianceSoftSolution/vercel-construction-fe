import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, Typography, MenuItem } from "@mui/material";
import CustomTextField from "@/mui/CustomTextField"; // Your custom text field component

// const schema = z.object({
//   businessStructure: z.string().min(1, "Business Structure is required"),
//   gstRegistered: z.string().min(1, "GST Registration is required"),
//   taxFileNumber: z.string()
//     .min(1, "Tax File Number is required"),
//   companyNumber: z.string().min(1, "Company Number is required"),
//   phone: z.string()
//     .min(1, "Phone number is required"),
//   fax: z.string().optional(),
//   website: z.string().optional(),
//   address: z.string().min(1, "Address is required"),
//   city: z.string().min(1, "City is required"),
//   state: z.string().min(1, "State is required"),
//   zip: z.string().min(1, "Zip/Postcode is required"),
//   country: z.string().min(1, "Country is required"),
// });

const schema = z.object({
  businessStructure: z.string().min(1, "Business Structure is required"),
  gstRegistered: z.boolean().optional(),
  taxFileNumber: z.string().optional(),
  companyNumber: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  website: z.string().optional(),
  address: z.string().min(1,"Address is required"),
  city: z.string().min(1, "City is Required"),
  state: z.string().min(1, "State is Required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is Requried"),
});

const CompanyInfoForm = ({
  onSubmit,
  onUpdate,
  setValidationStatus,
  initialValues,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  // const onSubmit = (data) => {
  //   console.log(data);
  //   // handle form submission logic here
  // };

  // Function to handle changes and update the parent component
  const handleChange = () => {
    const values = getValues(); // Get current form values
    console.log(values)
    if (isValid) {
      setValidationStatus(true);
    }
    onUpdate(values); // Call the onUpdate function with current values
  };
  useEffect(()=>{
    setValidationStatus(isValid)
  },[isValid])

  return (
    <Box backgroundColor={"white"} padding={3}>
      <Box paddingTop={0}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Company Information</span>
          </div>

          <Grid container spacing={2} className="mt-5 items-center">
            {/* Business Structure */}
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Business Structure"
                className="w-full"
                select
                error={!!errors.businessStructure}
                value={getValues("businessStructure")}
                helperText={errors.businessStructure?.message}
                {...register("businessStructure", { onChange: handleChange })}
              >
                <MenuItem value="S corporation">S Corporation</MenuItem>

                <MenuItem value="C corporation">C Corporation</MenuItem>
                <MenuItem value="Sole proprietorship">
                  Sole Proprietorship
                </MenuItem>
                <MenuItem value="LLC">Limited Liability Company (LLC)</MenuItem>
                <MenuItem value="Partnership">Partnership</MenuItem>
              </CustomTextField>
            </Grid>

            {/* GST Registered */}
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="GST Registered"
                className="w-full"
                select
                error={!!errors.gstRegistered}
                value={getValues("gstRegistered") ?? false}
                helperText={errors.gstRegistered?.message}
                {...register("gstRegistered", { onChange: handleChange })}
              >
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>

          <Grid
            container
            marginTop={2}
            spacing={2}
            className="mt-5 items-center"
          >
            {/* Tax File Number */}
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Tax File Number"
                className="w-full"
                error={!!errors.taxFileNumber}
                helperText={errors.taxFileNumber?.message}
                {...register("taxFileNumber", { onChange: handleChange })}
              />
            </Grid>

            {/* Company Number */}
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Company Number"
                className="w-full"
                error={!!errors.companyNumber}
                helperText={errors.companyNumber?.message}
                {...register("companyNumber", { onChange: handleChange })}
              />
            </Grid>
          </Grid>

          <Grid
            container
            marginTop={2}
            spacing={2}
            className="mt-5 items-center"
          >
            {/* Phone */}
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Phone"
                className="w-full"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...register("phone", { onChange: handleChange })}
              />
            </Grid>

            {/* Fax */}
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Fax"
                className="w-full"
                {...register("fax", { onChange: handleChange })}
              />
            </Grid>
          </Grid>

          {/* Website */}
          <CustomTextField
            label="Website"
            className="w-full mt-4"
            error={!!errors.website}
            helperText={errors.website?.message}
            {...register("website", { onChange: handleChange })}
          />

          {/* Company Address */}
          <Typography variant="h6" marginTop={2}>
            Company Address
          </Typography>

          <Box className="mt-4">
            <CustomTextField
              label="Address"
              className="w-full"
              error={!!errors.address}
              helperText={errors.address?.message}
              {...register("address", { onChange: handleChange })}
            />
          </Box>

          {/* City, State/Region, Zip, Country */}
          <Grid container spacing={2} marginTop={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="City"
                className="w-full"
                error={!!errors.city}
                helperText={errors.city?.message}
                {...register("city", { onChange: handleChange })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                label="State / Region"
                className="w-full"
                error={!!errors.state}
                helperText={errors.state?.message}
                {...register("state", { onChange: handleChange })}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} marginTop={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Zip / Postcode"
                className="w-full"
                error={!!errors.zip}
                helperText={errors.zip?.message}
                {...register("zip", { onChange: handleChange })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                label="Country"
                className="w-full"
                error={!!errors.country}
                helperText={errors.country?.message}
                {...register("country", { onChange: handleChange })}
              />
            </Grid>
          </Grid>

          {/* <Box marginTop={2}>
            <button
              // type="button"
              className="flex px-8 items-center justify-center bg-[#0074BD] text-white py-2 rounded-md text-nowrap"
            >
              + Add Postal address
            </button>
          </Box> */}

          <Box display={"flex"} justifyContent={"end"} marginTop={2}>
          <button
  onClick={!loading ? onSubmit : null}  
  className={`flex px-8 items-center justify-center py-2 rounded-md text-nowrap ${
    loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0074BD] text-white"
  }`}
  disabled={loading}  
>
  {loading ? (
    <span>Loading...</span>  
  ) : (
    <span>Submit</span>  
  )}
</button>
          </Box>
        </form> 
      </Box>
    </Box>
  );
};

export default CompanyInfoForm;
