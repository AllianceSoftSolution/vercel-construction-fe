import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Modal,
} from "@mui/material";
import CustomTextField from "../../mui/CustomTextField";
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Delete } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import RoundedButton from "../../mui/RoundedButton";
import CustomSecondaryButton from "../../mui/CustomSecondaryButton";
import { useDispatch } from "react-redux";
import { addClient } from "../../redux/clients";

// Define the validation schema using zod
const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Client Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  status: z.enum(["lead", "active", "archived", "inactive"]),
  enable_portal: z.boolean().optional(),
  parties: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Related party name is required"),
      type: z.string(),
    })
  ),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Tag name is required"),
    })
  ),
  last_updated: z.string().optional(),
  proposals: z.number(),
  proposal_year: z.string().optional(),
});

const customCheckboxStyles = {
  color: "#D4D4D4", // Unchecked color
  "&.Mui-checked": {
    color: "#86817d", // Checked color
  },
};

const CreateClientModal = ({ open, handleClose, setClientsArray, data }) => {
  const dispatch = useDispatch();
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: uuidv4(),
      name: "",
      email: "",
      phone_number: "",
      status: "lead",
      enable_portal: false,
      parties: [],
      tags: [], // Initialize tags as an empty array
      last_updated: new Date().toString(),
      proposals: 0,
      proposal_year: new Date().getFullYear().toString(),
    },
  });

  const {
    fields: partyFields,
    append: appendParty,
    remove: removeParty,
  } = useFieldArray({
    control,
    name: "parties",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });
  useEffect(() => {
    if (data) {
      // Pre-fill the form with existing client data
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = (formData) => {
    if (data) {
      // Update existing client logic
      dispatch(addClient(formData));
    } else {
      // Create new client logic
      dispatch(addClient(formData));
    }
    reset({
      id: uuidv4(),
      name: "",
      email: "",
      phone_number: "",
      status: "lead",
      enable_portal: false,
      parties: [],
      tags: [], // Initialize tags as an empty array
      last_updated: new Date(),
      proposals: 0,
      proposal_year: new Date().getFullYear().toString(),
    });
    handleClose();
  };

  const addNewParty = () => {
    appendParty({ id: uuidv4(), name: "", type: "1040" });
  };

  const addNewTag = () => {
    appendTag({ id: uuidv4(), name: "" });
  };

  const deleteParty = (index) => {
    removeParty(index);
  };

  const deleteTag = (index) => {
    removeTag(index);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box sx={{ ...style, overflowY: "auto" }}>
        <h4 className="text-[24px] font-medium pb-4">Create new client</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-y-3 pt-4 border-t border-black/20"
        >
          <div className="flex items-center flex-col md:flex-row w-full gap-3">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="Client Name"
                  className="w-full md:w-1/2"
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="Email"
                  className="w-full md:w-1/2"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              )}
            />
          </div>
          <div className="flex items-center flex-col md:flex-row w-full gap-3">
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="Phone number"
                  className="w-full md:w-1/2"
                  error={!!errors.phone_number}
                  helperText={
                    errors.phone_number ? errors.phone_number.message : ""
                  }
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="Status"
                  className="w-full md:w-1/2"
                  select
                  error={!!errors.status}
                  helperText={errors.status ? errors.status.message : ""}
                >
                  <MenuItem value="lead">Lead</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </CustomTextField>
              )}
            />
          </div>
          <FormControlLabel
            control={
              <Controller
                name="enable_portal"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} sx={customCheckboxStyles} />
                )}
              />
            }
            label="Enable client portal"
          />
          {/* Related Parties Section */}
          <div className="related_party p-3 bg-[#f7f7f7] rounded-lg flex flex-col gap-y-3">
            {partyFields.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 flex-wrap justify-center sm:flex-nowrap"
              >
                <Controller
                  name={`parties.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label="Related party"
                      className="w-full md:w-1/2"
                      error={!!errors.parties?.[index]?.name}
                      helperText={
                        errors.parties?.[index]?.name
                          ? errors.parties[index].name.message
                          : ""
                      }
                    />
                  )}
                />
                <Controller
                  name={`parties.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label="Type"
                      className="w-full md:w-1/2"
                      select
                      error={!!errors.parties?.[index]?.type}
                      helperText={
                        errors.parties?.[index]?.type
                          ? errors.parties[index].type.message
                          : ""
                      }
                    >
                      {[
                        "1040",
                        "1120",
                        "1120s",
                        "1065",
                        "Sch C",
                        "Sch E",
                        "Sch F",
                        "1041",
                        "990",
                        "Other",
                      ].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
                <IconButton
                  className="self-end"
                  onClick={() => deleteParty(index)}
                >
                  <Delete />
                </IconButton>
              </div>
            ))}
            <button
              onClick={addNewParty}
              className="px-3 py-2 text-[#0074BD] self-start"
            >
              <Add />
              Related party
            </button>
          </div>
          {/* Tags Section */}
          <div className="tags_section p-3 bg-[#f7f7f7] rounded-lg flex flex-col gap-y-3">
            {tagFields.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 flex-wrap justify-center sm:flex-nowrap"
              >
                <Controller
                  name={`tags.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label="Tag"
                      className="w-full md:w-1/2"
                      error={!!errors.tags?.[index]?.name}
                      helperText={
                        errors.tags?.[index]?.name
                          ? errors.tags[index].name.message
                          : ""
                      }
                    />
                  )}
                />
                <IconButton
                  className="self-end"
                  onClick={() => deleteTag(index)}
                >
                  <Delete />
                </IconButton>
              </div>
            ))}
            <button
              onClick={addNewTag}
              className="px-3 py-2 text-[#0074BD] self-start"
            >
              <Add />
              Tag
            </button>
          </div>
          <Box className="w-full flex flex-col md:flex-row items-center justify-end mt-4 gap-2">
            <CustomSecondaryButton
              type="button"
              className="rounded-lg w-full md:w-auto bg-transparent px-8 py-2"
              onClick={() => handleClose()}
            >
              Cancel
            </CustomSecondaryButton>
            <RoundedButton
              type="submit"
              className="rounded-lg w-full md:w-auto bg-[#0074BD] px-8 py-2 text-white"
              onClick={handleSubmit(onSubmit)}
            >
              {data ? "Update Client" : "Create Client"}
            </RoundedButton>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateClientModal;
