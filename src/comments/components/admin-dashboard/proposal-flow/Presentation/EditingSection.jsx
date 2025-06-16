import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  styled,
  Autocomplete,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MdOutlineFileUpload } from "react-icons/md";
import RoundedButton from "../../../../mui/RoundedButton";
import CustomTextField from "../../../../mui/CustomTextField";
import RichTextEditor from "../../../RichTextEditor";
import IOSSwitch from "../../../IOSSwitch";
import { z } from "zod";
import { Delete } from "@mui/icons-material";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// Styled components
// Styled components
const CustomAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none", // Remove default shadow
  border: "1px solid rgba(0, 0, 0, 0.2)", // Add custom border
  width: "100%", // Ensure accordion maintains full width
  overflow: "hidden", // Fix border-radius overlap
  borderRadius: "8px", // Apply border radius to all corners
  // marginBottom: "1rem", // Spacing between accordions
  "&:first-of-type": {
    //   marginTop: "0.5rem", // Optional spacing at the top for the first accordion
    borderTopLeftRadius: "8px", // Ensures top left is rounded
    borderTopRightRadius: "8px", // Ensures top right is rounded
  },
  "&:last-of-type": {
    //   marginBottom: "0.5rem", // Optional spacing at the bottom for the last accordion
    borderBottomLeftRadius: "8px", // Ensures bottom left is rounded
    borderBottomRightRadius: "8px", // Ensures bottom right is rounded
  },
  "&.Mui-expanded": {
    margin: 0, // Ensure margin reset when expanded
  },
}));

const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "white", // Custom background for summary
  ".MuiAccordionSummary-content": {
    margin: theme.spacing(1, 0), // Reduce default margin
  },
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  paddingTop: 0,
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const emailSchema = z.string().email({ message: "Invalid email address" });

const EditingSection = ({ setValues }) => {
  const [selectedValues, setSelectedValues] = useState();
  const [nextStepTemplate, setnextStepTemplate] = useState();
  const [nextStepsEmailDescription, setnextStepsEmailDescription] = useState();
  const [bodyText, setbodyText] = useState();
  const intialState = {
    introductionImage: null,
    introductionBrochure: null,
    introductionPage: {
      messageTemplate: {
        id: null,
        body: "",
      },
      introductionVideo: null,
    },
    pricingPage: {
      showPricePerService: false,
    },
    nextSteps: {
      video: null,
      message: {
        id: "",
        body: "",
      },
    },
    email: {
      id: "",
      email: "",
    },
    recipientEmails: [],
  };
  const [data, setData] = useState([]);
  const [emaildata, setemailData] = useState([]);
  const [loading, setloading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [collectData, setCollectData] = useState(intialState);

  const { user } = useSelector((state) => state.auth);

  const setFile = (file) => {
    setCollectData((prevState) => ({
      ...prevState,
      introductionImage: file, // Update the introductionImage
    }));
  };
  const setVideo = (file) => {
    setCollectData((prevState) => ({
      ...prevState,
      introductionPage: {
        ...prevState.introductionPage,
        introductionVideo: file, // Update the introductionImage
      },
    }));
  };
  const setBrochure = (file) => {
    setCollectData((prevState) => ({
      ...prevState,
      introductionBrochure: file, // Update the introductionImage
    }));
  };
  const fetchData = async () => {
    setloading(true);
    const result = await apiClient.get(`templates/messages`);
    const result2 = await apiClient.get(`templates/emails`);
    if (!result.ok || !result2.ok) {
      toast.error("Something went wrong");
      setloading(false);
      return;
    }
    setData(result.data.data);
    setemailData(result2.data.data);

    setloading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setCollectData((prevState) => ({
      ...prevState,
      introductionPage: {
        ...prevState.introductionPage,
        messageTemplate: {
          id:
            selectedValues?._id ||
            prevState.introductionPage.messageTemplate.id,
          body: bodyText || prevState.introductionPage.messageTemplate.body,
        },
      },
    }));
  }, [selectedValues, bodyText]);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // State to hold email fields
  const [emails, setEmails] = useState([{ email: "", error: "" }]);

  // Function to handle input change for each email field
  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index].email = value;

    // Validate the email using Zod
    try {
      emailSchema.parse(value);
      newEmails[index].error = ""; // Clear error if valid
    } catch (err) {
      newEmails[index].error = err.errors[0].message; // Set error message if invalid
    }

    setEmails(newEmails); // Update the state
  };

  // Function to add a new email field
  const handleAddField = () => {
    setEmails([...emails, { email: "", error: "" }]); // Append a new email object
  };

  // Function to delete an email field
  const handleDeleteField = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails); // Update the state to remove the selected email
  };
  const clientId = localStorage.getItem("ClientIdForPurposal");
  const [client, setclient] = useState([]);
  const fetchClient = async () => {
    setloading(true);
    const result = await apiClient.get(`client/${clientId}`);
    if (!result.ok) {
      toast.error("Something went wrong");
      setloading(false);
      return;
    }
    setclient(result.data.client);

    setloading(false);
  };
  useEffect(() => {
    fetchClient();
  }, [clientId]);
  useEffect(() => {
    const defaultTerms = data?.find(
      (option) => option._id === "67078b8b1eadbc1ffcf400d0"
    );
    let updatedDescription = defaultTerms?.description
      .replace(/{{address}}/g, client?.personalInfo?.primaryContact?.address)
      .replace(
        /{{contact_name}}/g,
        client?.personalInfo?.primaryContact?.name || client?.personalInfo?.name
      )
      .replace(/{{practice_name}}/g, user?.name)
      .replace(/{{client}}/g, client?.personalInfo?.name);
    setSelectedValues({ ...defaultTerms, description: updatedDescription });
    setbodyText(updatedDescription);
  }, [data, client]);
  const handleChange = (event, newValue) => {
    if (newValue && client?.personalInfo?.name) {
      const updatedDescription = newValue.description
        .replace(`{{address}}`, client?.personalInfo?.primaryContact?.address)
        .replace(
          `{{contact_name}}`,
          client?.personalInfo?.primaryContact?.name ||
            client?.personalInfo?.name
        )
        .replace(`{{client}}`, client?.personalInfo?.name)
        .replace(`{{practice_name}}`, user?.name);
      // Update selectedValues with the modified description
      setSelectedValues({ ...newValue, description: updatedDescription });
      setbodyText(updatedDescription);
    } else {
      setSelectedValues(newValue);
    }
  };
  console.log(selectedValues, "updatedDescription");
  const handleNextStepChange = (event, newValue) => {
    if (newValue && client?.personalInfo?.name) {
      const updatedDescription = newValue.description.replace(
        `{{client}}`,
        client?.personalInfo?.name
      );
      setnextStepTemplate(newValue);
      setCollectData((prevState) => ({
        ...prevState,
        nextSteps: {
          ...prevState.nextSteps,
          message: {
            id: newValue?._id || prevState.nextSteps.message.id,
            body: updatedDescription,
          },
        },
      }));
    } else {
      setnextStepTemplate(newValue);
      setCollectData((prevState) => ({
        ...prevState,
        nextSteps: {
          ...prevState.nextSteps,
          message: {
            id: newValue?._id || prevState.nextSteps.message.id,
            body: newValue?.description,
          },
        },
      }));
    }
  };
  // Handle body text change from RichTextEditor
  const handleBodyChange = (value) => {
    setbodyText(value); // Update local state for body text
    setCollectData((prevState) => ({
      ...prevState,
      nextSteps: {
        ...prevState.nextSteps,
        message: {
          ...prevState.nextSteps.message,
          body: value, // Update body in collectData
        },
      },
    }));
  };
  const setNextStepVideo = (file) => {
    setCollectData((prevState) => ({
      ...prevState,
      nextSteps: {
        ...prevState.nextSteps,
        video: file, // Update the introductionImage
      },
    }));
  };
  const handlemailChange = (event, newValue) => {
    if (newValue && client?.personalInfo?.name) {
      const updatedDescription = newValue.description.replace(
        `{{client}}`,
        client?.personalInfo?.name
      );
      setnextStepsEmailDescription(updatedDescription);
    }
    setCollectData((prevState) => ({
      ...prevState,
      email: {
        id: newValue?._id || prevState.email.id,
        // email: newValue?.description,
      },
    }));
  };
  useEffect(() => {
    const validEmails = emails
      .filter((emailObj) => emailObj.error === "") // Only get valid emails
      .map((emailObj) => emailObj.email); // Extract email values

    setCollectData((prevState) => ({
      ...prevState,
      recipientEmails: validEmails, // Replace the recipientEmails array
    }));
  }, [emails]);
  useEffect(() => {
    setValues(collectData);
  }, [collectData]);
  return (
    <div className="w-[53%] flex flex-col gap-y-2">
      {/* Customized Accordion 1 */}
      <CustomAccordion
        expanded={expanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <CustomAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1"
        >
          <div className="w-full leading-tight ">
            <h5>Introduction Page</h5>
            <p className="text-black/50">Add a message, Video or brochure</p>
          </div>
        </CustomAccordionSummary>
        <CustomAccordionDetails className="flex flex-col gap-y-3">
          <div className="w-full border-t border-black/50 pb-[8px]" />
          <UploadImage setFile={setFile} />
          {/* <Autocomplete
            size="small"
            disablePortal
            options={[
              "test1@example.com",
              "test2@example.com",
              "test3@example.com",
              "test4@example.com",
              "test5@example.com",
              "test6@example.com",
              "test7@example.com",
              "test8@example.com",
            ]}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <CustomTextField {...params} label={"Display message from"} />
            )}
          /> */}
          <Autocomplete
            size="small"
            disablePortal
            value={selectedValues}
            options={data?.filter((option) => option.type === "introduction")}
            getOptionLabel={(option) => option.name} // Show the 'name' in the dropdown
            isOptionEqualToValue={(option, value) => option._id === value._id} // Compare by 'id'
            sx={{ width: "100%" }}
            onChange={handleChange} // Update selected values
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            renderInput={(params) => (
              <CustomTextField {...params} label="Message Template" />
            )}
          />
          <RichTextEditor
            editorContent={bodyText || selectedValues?.description || ""}
            handleChange={(value) => setbodyText(value)}
          />
          {/* <button
            // onClick={() => handleClientModalOpen()}
            className="flex items-center justify-center bg-[#0074BD33] px-4 py-2 rounded-md w-fit"
          >
            Save as Template
          </button> */}
          <div style={{ display: "block", height: "20px" }}></div>
          <IntroVideo setFile={setVideo} />
          <BrouchurePDF setFile={setBrochure} />
          {/* <CustomTextField label={"Display message from"} /> */}
        </CustomAccordionDetails>
      </CustomAccordion>
      <CustomAccordion
        expanded={expanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <CustomAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel2"
        >
          <div className="w-full leading-tight ">
            <h5>Pricing Page</h5>
            <p className="text-black/50">
              Change how services and prices display
            </p>
          </div>
        </CustomAccordionSummary>
        <CustomAccordionDetails className="flex flex-col gap-y-3">
          <div className="w-full border-t border-black/50 pb-[8px]" />
          <div className="switch-button-card flex flex-col gap-y-1">
            <p>Show price per service</p>
            <IOSSwitch
              checked={collectData?.pricingPage?.showPricePerService} // Set the switch checked state based on the current data
              onChange={(e) => {
                const isChecked = e.target.checked;
                setCollectData((prevState) => ({
                  ...prevState,
                  pricingPage: {
                    ...prevState.pricingPage,
                    showPricePerService: isChecked, // Update the specific field
                  },
                }));
              }}
            />
          </div>
          {/* <div className="switch-button-card flex flex-col gap-y-1">
            <p>Show one-off and deposit services as Billed on completion</p>
            <IOSSwitch />
          </div>
          <div className="switch-button-card flex flex-col gap-y-1">
            <p>Show the minimum price to pay over the contract period</p>
            <IOSSwitch />
          </div> */}
          {/* <CustomTextField label={"Display message from"} /> */}
        </CustomAccordionDetails>
      </CustomAccordion>
      <CustomAccordion
        expanded={expanded === "panel3"}
        onChange={handleAccordionChange("panel3")}
      >
        <CustomAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3"
        >
          <div className="w-full leading-tight ">
            <h5>Next Steps page</h5>
            <p className="text-black/50">
              Display message or video after you client accepts the proposal
            </p>
          </div>
        </CustomAccordionSummary>
        <CustomAccordionDetails className="flex flex-col gap-y-3">
          <div className="w-full border-t border-black/50 pb-[8px]" />
          <Autocomplete
            size="small"
            disablePortal
            options={data?.filter((option) => option.type === "next step")}
            getOptionLabel={(option) => option.name} // Show the 'name' in the dropdown
            isOptionEqualToValue={(option, value) => option._id === value._id} // Compare by 'id'
            sx={{ width: "100%" }}
            onChange={handleNextStepChange} // Update selected values
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            renderInput={(params) => (
              <CustomTextField {...params} label="Message Template" />
            )}
          />
          {/* RichTextEditor Component */}
          <RichTextEditor
            editorContent={
              nextStepTemplate?.body || collectData.nextSteps.message.body || ""
            }
            handleChange={handleBodyChange} // Use the new handleBodyChange function
          />
          {/* <button
            // onClick={() => handleClientModalOpen()}
            className="flex items-center justify-center bg-[#0074BD33] px-4 py-2 rounded-md w-fit"
          >
            Save as Template
          </button> */}
          <div style={{ display: "block", height: "20px" }}></div>
          <NextStepsVideo setFile={setNextStepVideo} />
          {/* <BrouchurePDF /> */}
          {/* <CustomTextField label={"Display message from"} /> */}
        </CustomAccordionDetails>
      </CustomAccordion>
      <CustomAccordion
        expanded={expanded === "panel4"}
        onChange={handleAccordionChange("panel4")}
      >
        <CustomAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4"
        >
          <div className="w-full leading-tight ">
            <h5>Email</h5>
            <p className="text-black/50">
              Edit the email sent when you send the proposal
            </p>
          </div>
        </CustomAccordionSummary>
        <CustomAccordionDetails className="flex flex-col gap-y-3">
          <div className="w-full border-t border-black/50 pb-[8px]" />
          <Autocomplete
            size="small"
            disablePortal
            options={emaildata}
            getOptionLabel={(option) => option.name} // Show the 'name' in the dropdown
            isOptionEqualToValue={(option, value) => option._id === value._id} // Compare by 'id'
            sx={{ width: "100%" }}
            onChange={handlemailChange} // Update selected values
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label={"Email template"}
                subLabel="Select which New proposal email template to send"
              />
            )}
          />
          <RichTextEditor
            editorContent={nextStepsEmailDescription}
            handleChange={(e) => console.log(e)}
            readOnly={true}
          />
          <div style={{ display: "block", height: "20px" }}></div>
          <div className="flex flex-col w-full gap-y-4">
            {emails.map((emailObj, index) => (
              <div key={index} className="flex items-end w-full gap-x-2">
                {/* Input Field for Adding Emails */}
                <CustomTextField
                  sx={{ width: "100%" }}
                  type="email"
                  placeholder="Enter recipient's email address"
                  value={emailObj.email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  error={!!emailObj.error} // Add error state to the text field if needed
                  helperText={emailObj.error} // Display the error message
                />
                <button
                  onClick={handleAddField} // This adds a new email field
                  disabled={emailObj.error !== "" || emailObj.email === ""}
                  className="flex items-center justify-center bg-[#0074BD33] 
                       disabled:bg-[#0074BD]/10 disabled:text-black/40 
                       disabled:cursor-not-allowed py-2 px-4 rounded-md text-nowrap"
                >
                  Add email
                </button>
                {emails.length > 1 && ( // Show delete button only if there are 2 or more email fields
                  <>
                    {/* <button
                      onClick={() => handleDeleteField(index)} // This deletes the email field
                      className="flex items-center justify-center bg-red-500 text-white py-2 rounded-md"
                    >
                      Delete
                    </button> */}
                    <IconButton
                      onClick={() => handleDeleteField(index)} // This deletes the email field
                      className="flex items-center justify-center bg-red-500 text-white py-2 rounded-md"
                    >
                      <Delete />
                    </IconButton>
                  </>
                )}
              </div>
            ))}
          </div>
        </CustomAccordionDetails>
      </CustomAccordion>
    </div>
  );
};

export default EditingSection;

const UploadImage = ({ setFile }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const formData = new FormData(); // Create a new FormData object
      formData.append("presentation", file); // Append the file to FormData
      formData.forEach((value, key) => {
        console.log(`${key}:`, value, "asasasasasasa");
      });
      // Here you can add your future functionality
    }
    console.log("asasasasasasa", file instanceof Blob);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFile(file);
      // Here you can add your future functionality
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div
      className={`w-full rounded-lg border-2 border-dashed p-3 flex flex-col gap-y-1 items-center cursor-pointer ${
        dragOver ? "border-blue-400" : "border-black/30"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("fileInput").click()}
    >
      <MdOutlineFileUpload className="text-[25px] text-black/50" />
      <RoundedButton className="rounded-xl text-sm">Upload</RoundedButton>
      <p className="text-black/50 text-xs">PNG, JPG file size max 5MB</p>

      {/* Hidden input for file selection */}
      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
};

const IntroVideo = ({ setFile }) => {
  return (
    <div className="flex items-start flex-col gap-y-1 leading-tight w-full">
      <p className="">Introduction video</p>
      <p className="text-black/50 text-sm">
        Embed a Loom, YouTube or Vimeo video.
      </p>

      <input
        type="url"
        placeholder="https://www.video.com/"
        className="p-2 border"
        id="videoInp"
        onChange={(e) => {
          setFile(e.target.value);
        }}
      />
      {/* <label
      htmlFor="videoInp"
        // onClick={() => handleClientModalOpen()}
        className="flex items-center justify-center bg-[#0074BD33] py-2 px-4 rounded-md"
      >
        Add video
      </label> */}
    </div>
  );
};

const BrouchurePDF = ({ setFile }) => {
  return (
    <div className="flex items-start flex-col gap-y-1 leading-tight w-full">
      <p className="">Brochure (PDF)</p>
      <p className="text-black/50 text-sm">
        Add a brochure to your proposal to provide additional marketing or
        supportive content to your client.
      </p>
      <input
        type="file"
        accept=".pdf"
        hidden
        id="broInp"
        onChange={(e) => {
          const file = e.target.files[0];
          setFile(file);
        }}
      />
      <label
        style={{ cursor: "pointer" }}
        htmlFor="broInp"
        // onClick={() => handleClientModalOpen()}
        className="flex items-center justify-center bg-[#0074BD33] py-2 px-4 rounded-md"
      >
        Select or upload brochure
      </label>
    </div>
  );
};

const NextStepsVideo = ({ setFile }) => {
  return (
    <div className="flex items-start flex-col gap-y-1 leading-tight w-full">
      <p className="">Next steps video</p>
      <p className="text-black/50 text-sm">
        Embed a Loom, YouTube or Vimeo video.
      </p>
      <input
        type="url"
        placeholder="https://www.video.com/"
        className="p-2 border"
        id="viInp"
        onChange={(e) => {
          setFile(e.target.value);
        }}
      />
      {/* <label
      style={{cursor: "pointer"}}
      htmlFor="viInp"
        // onClick={() => handleClientModalOpen()}
        className="flex items-center justify-center bg-[#0074BD33] py-2 px-4 rounded-md"
      >
        Add video
      </label> */}
    </div>
  );
};
