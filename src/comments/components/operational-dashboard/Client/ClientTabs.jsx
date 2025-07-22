import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  styled,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchAndFilterbar from "../SearchAndFilterbar";
import SimpleTable from "../../SimpleTable";
import { Delete, Edit, RowingSharp } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { ConfirmationDialog } from "../../ConfirmationDialog";
import { getStatusColor } from "../../../utils";
import { Link, useNavigate } from "react-router-dom";
// import { selectClientsArray } from "../../../redux/clients";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  add_client,
  remove_client,
  edit_client,
  select_clients_array,
} from "../../../redux/admin_client";
import { formatDateDMY } from '../../../../utils';
import apiClient from "../../../api/apiClient";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: "#0074BD", // Indicator color
    height: "3px",
  },
}));
const dummy_data = [
  {
    id: 5,
    client: "Mike Davis",
    status: "Active",
    primaryContact: "mikedavis@example.com",
    paymentMethods: "Bank Transfer, Credit Card",
    activity: "Last login: 2024-09-12",
  },
];
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    width: "fit-content",
    maxWidth: "fit-content",
    minWidth: "100px",
    padding: 0,
    color: "black", // Text color
    // fontWeight: "bold", // Active tab text bold
    "&.Mui-selected": {
      color: "#0074BD",
      fontWeight: "bold",
    },
    "&:hover": {
      //   color: "#FFB400", // Hover color
      opacity: 1,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(0, 116, 189, 0.32)", // Focus color
    },
  })
);

// const columns = [
//   { field: "client", headerName: "Client" },
//   { field: "status", headerName: "Status" },
//   { field: "primaryContact", headerName: "PrimaryContact" },
//   { field: "tags", headerName: "Tags" },
//   { field: "paymentMethods", headerName: "PaymentMethods" },
//   { field: "activity", headerName: "Activity" },
//   { field: "actions", headerName: "Actions" },
// ];

const columns = [
  { field: "name", headerName: "Name" },
  { field: "status", headerName: "Status" },
  { field: "tags", headerName: "Tags" },
  // { field: "proposal_year", headerName: "Proposal Year" },
  { field: "proposals", headerName: "Proposals" },
  { field: "last_updated", headerName: "Last updated" },
  // { field: "actions", headerName: "Actions" },
];

const data = [];
const ClientTabs = ({
  data,
  setPage,
  fetchData,
  loading,
  setloading,
  setSearchValue,
  config,
}) => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState("all");
  const handleTabChange = (event, newValue) => {
    console.log(clientsArray, "org_cleinT_array");
    const clients_array = clientsArrayRedux.map((client) => ({
      id: client._id, // Use client ID from clientsArrayRedux
      name: client, // Assign the client ID to the 'client' field
      status: client.personalInfo?.status, // Map the 'status' field
      tags: client.personalInfo?.tags, // Map the 'email' field to 'primaryContact'
      paymentMethods: "N/A", // Static value (you can modify as needed)
      last_updated: client.personalInfo.activity.updatedAt
        ? `${formatDateDMY(client.personalInfo.activity.updatedAt)}`
        : "No activity",
      actions: client._id,

      // id: client.id, // Use client ID from clientsArrayRedux
      // client: client.clientName, // Assign the client ID to the 'client' field
      // status: client.status, // Map the 'status' field
      // primaryContact: client.contactEmail, // Map the 'email' field to 'primaryContact'
      // paymentMethods: "Bank Transfer, Credit Card", // Static value (you can modify as needed)
      // activity: `Last login: ${Date.now() || "Unknown"}`, // Dynamic last login (or "Unknown" if missing)
      // actions: client.id,
    }));

    console.log(newValue, "new value");

    const filtered =
      newValue === "all"
        ? setClientsArray(clients_array)
        : setClientsArray(
            clients_array.filter((client) => client.status === newValue)
          );

    setTabValue(newValue);
  };

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down(768));

  const clientsArrayRedux = useSelector(select_clients_array);
  const [clientsArray, setClientsArray] = useState([]);
  const [clientsArrayFiltered, setclientsArrayFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(
    "Are you sure you want to delete this client?"
  );
  const [clientToBeDeleted, setClientToBeDeleted] = useState("");
  const setFilteredArray = () => {
    switch (tabValue) {
      case "all":
        console.log("all", "clientToBeDeleted");
        setclientsArrayFiltered(data);
        break;
      case "lead":
        console.log("leads", "clientToBeDeleted");
        setclientsArrayFiltered(
          data.filter(
            (client) => client.personalInfo.status?.toLowerCase() === "lead"
          )
        );
        console.log(
          data.filter(
            (client) => client.personalInfo.status?.toLowerCase() === "lead"
          ),
          "clientToBeDeleted"
        );
        break;
      case "active":
        setclientsArrayFiltered(
          data.filter(
            (client) => client.personalInfo.status?.toLowerCase() === "active"
          )
        );
        break;
      case "archived":
        setclientsArrayFiltered(
          data.filter(
            (client) => client.personalInfo.status?.toLowerCase() === "archived"
          )
        );
        break;
      case "inactive":
        setclientsArrayFiltered(
          data.filter(
            (client) => client.personalInfo.status?.toLowerCase() === "inactive"
          )
        );
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    setFilteredArray();
  }, [data, tabValue]);

  // CLIENT_EDIT_DELETE

  const editClient = (id) => {
    navigate("/admin-dashboard/clients/create-client", {
      state: {
        id: id,
        mode: "edit",
      },
    });
  };

  const deleteClient = (id) => {
    dispatch(remove_client({ id: id }));
    toast.success("Client Deleted Successfully!", {
      position: "top-right",
      duration: 3000, // Auto close after 3 seconds
    });
  };

  // CLIENT_EDIT_DELETE

  const CustomNameCell = ({ value }) => {
    console.log(value, "kkkk");
    return <Link to={`${value._id}`}>{value.personalInfo?.name}</Link>;
  };

  const CustomStatusCell = ({ value }) => {
    console.log(">>>>>", value);
    const status = value?.toLowerCase();

    return (
      <Chip
        label={value}
        sx={{
          bgcolor: getStatusColor(status),
        }}
        size="medium"
      />
    );
  };

  const CustomTagComponent = ({ value }) => {
    // console.log(value, "tags");

    return (
      <>
        {value?.map((val) => {
          return (
            <>
              <Chip
                label={val}
                sx={{ bgcolor: "#0074BD", color: "white", marginRight: 1 }}
                size="small"
              />
            </>
          );
        })}
      </>
    );
  };

  const CustomActionCell = ({ value }) => {
    return (
      <div className="flex items-center">
        <IconButton size="small" onClick={() => editClient(value)}>
          <Edit />
        </IconButton>
        {/* {   console.log(value,'sdsdds')} */}
        <IconButton size="small" onClick={() => handleOpen(value)}>
          <Delete />
        </IconButton>
      </div>
    );
  };
  const CustomLastUpdated = ({ value }) => {
    // Check if value is a Date object
    if (value instanceof Date) {
      // Options for date formatting
      const options = {
        month: "long", // Full month name
        day: "numeric", // Numeric day
        year: "numeric", // Full year
        hour: "numeric", // Numeric hour
        minute: "numeric", // Numeric minute
        hour12: true, // 12-hour format with AM/PM
      };

      // Format the date object to a string
      const formattedDate = value.toLocaleString("en-US", options);

      return <div>{formattedDate}</div>;
    }

    // If the value is a string, show it as it is
    return <div>{value}</div>;
  };

  const CustomClientCell = ({ value }) => {
    console.log(value, "kkkk");
    return <Link to={`${value}`}>{value}</Link>;
  };
  const cellComponents = {
    name: CustomNameCell,
    actions: CustomActionCell,
    status: CustomStatusCell,
    client: CustomClientCell,
    tags: CustomTagComponent,
  };
  console.log(data);

  useEffect(() => {
    const clients_array = clientsArrayFiltered?.map((client) => ({
      id: client._id, // Use client ID from clientsArrayRedux
      name: client, // Assign the client ID to the 'client' field
      status: client.personalInfo?.status, // Map the 'status' field
      tags: client.personalInfo?.tags, // Map the 'email' field to 'primaryContact'
      proposals:
        client?.proposals?.length > 0
          ? `${client.proposals.length} Proposals`
          : `No Proposals`,
      paymentMethods: "N/A", // Static value (you can modify as needed)
      last_updated: client.personalInfo.activity.updatedAt
        ? `${formatDateDMY(client.personalInfo.activity.updatedAt)}`
        : "No activity",
      actions: client._id,

      // id: client._id, // Use client ID from clientsArrayRedux
      // client: client.personalInfo?.name, // Assign the client ID to the 'client' field
      // status: client.personalInfo?.status, // Map the 'status' field
      // primaryContact: client.personalInfo.primaryContact?.email, // Map the 'email' field to 'primaryContact'
      // paymentMethods: "N/A", // Static value (you can modify as needed)
      // activity: `Last Updated: ${formatDate(
      //   client.personalInfo.activity.updatedAt
      // )}`, // Dynamic last login (or "Unknown" if missing)
      // actions: client._id,
    }));

    setClientsArray(clients_array);
  }, [clientsArrayFiltered]);

  const handleConfirm = async () => {
    // deleteClient(clientToBeDeleted)

    setloading(true);
    const result = await apiClient.delete(`client/${clientToBeDeleted}`);
    if (!result.ok) {
      toast.error("Something went wrong");
      setloading(false);
      return;
    }
    toast.success("Client deleted successfully");
    fetchData();

    setloading(false);
  };
  const handleOpen = (id) => {
    setClientToBeDeleted(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setClientToBeDeleted("");
  };

  // console.log(clientsArray,'cleint array')

  return (
    <>
      <div>
        <ConfirmationDialog
          text={text}
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
        <Box sx={{ borderBottom: 1, borderColor: "#BFC6D4" }}>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isSmall ? "scrollable" : "standard"}
            scrollButtons
            allowScrollButtonsMobile
            aria-label="basic tabs example"
          >
            <StyledTab value="all" label="All" />
            <StyledTab value="lead" label="Leads" />
            <StyledTab value="active" label="Active" />
            <StyledTab value="archived" label="Archived" />
            <StyledTab value="inactive" label="Inactive" />
          </StyledTabs>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: "-2px" }} />
        </Box>

        <SearchAndFilterbar
          hideFilters={true}
          length={clientsArray?.length}
          setSearchValue={setSearchValue}
        />

        {loading ? (
          <Box className="flex justify-center items-center">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ marginTop: 2 }}>
            {tabValue === "all" && (
              <SimpleTable
                columns={columns}
                // data={clientsArrayFiltered}
                data={clientsArray}
                setPage={setPage}
                cellComponents={cellComponents}
                config={config}
              />
            )}
            {tabValue === "lead" && (
              <SimpleTable
                columns={columns}
                // data={clientsArrayFiltered}
                data={clientsArray}
                cellComponents={cellComponents}
              />
            )}
            {tabValue === "active" && (
              <SimpleTable
                columns={columns}
                data={clientsArray}
                cellComponents={cellComponents}
              />
            )}
            {tabValue === "archived" && (
              <SimpleTable
                columns={columns}
                data={clientsArray}
                cellComponents={cellComponents}
              />
            )}
            {tabValue === "inactive" && (
              <SimpleTable
                columns={columns}
                data={clientsArray}
                cellComponents={cellComponents}
              />
            )}
          </Box>
        )}
      </div>
    </>
  );
};

export default ClientTabs;

// working

// import {
//   Box,
//   Chip,
//   IconButton,
//   styled,
//   Tab,
//   Tabs,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import SearchAndFilterbar from "../SearchAndFilterbar";
// import SimpleTable from "../../SimpleTable";
// import { Delete, Edit } from "@mui/icons-material";
// import { v4 as uuidv4 } from "uuid";
// import CreateClientModal from "../../user-dash/CreateClientModal";
// import { getStatusColor } from "../../../utils";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { selectClientsArray } from "../../../redux/clients";
// import apiClient from "../../../api/apiClient";
// import { formatDate } from "../../../modules/helpers";
// import toast from "react-hot-toast";

// const StyledTabs = styled(Tabs)(({ theme }) => ({
//   "& .MuiTabs-indicator": {
//     backgroundColor: "#0074BD", // Indicator color
//     height: "3px",
//   },
// }));

// const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
//   ({ theme }) => ({
//     textTransform: "none",
//     width: "fit-content",
//     maxWidth: "fit-content",
//     minWidth: "100px",
//     padding: 0,
//     color: "black", // Text color
//     // fontWeight: "bold", // Active tab text bold
//     "&.Mui-selected": {
//       color: "#0074BD",
//       fontWeight: "bold",
//     },
//     "&:hover": {
//       //   color: "#FFB400", // Hover color
//       opacity: 1,
//     },
//     "&.Mui-focusVisible": {
//       backgroundColor: "rgba(0, 116, 189, 0.32)", // Focus color
//     },
//   })
// );

// const columns = [
//   { field: "name", headerName: "Name" },
//   { field: "status", headerName: "Status" },
//   { field: "tags", headerName: "Tags" },
//   // { field: "proposal_year", headerName: "Proposal Year" },
//   { field: "proposals", headerName: "Proposals" },
//   { field: "last_updated", headerName: "Last updated" },
//   // { field: "actions", headerName: "Actions" },
// ];

// const ClientTabs = () => {
//   const dispatch = useDispatch();
//   const [tabValue, setTabValue] = useState("all");
//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };
//   const theme = useTheme();
//   const isSmall = useMediaQuery(theme.breakpoints.down(768));

//   // States for data
//   const [clientsArray, setClientsArray] = useState([]);

//   const [count, setCount] = useState();
//   const [page, setPage] = useState(1);
//   const [data, setData] = useState();
//   const [loading, setloading] = useState(false);
//   const fetchData = async () => {
//     setloading(true);
//     const result = await apiClient.get(`client/?page=${page}`);
//     if (!result.ok) {
//       toast.error("Something went wrong");
//       setloading(false);
//       return;
//     }
//     // console.log(result);
//     setData(result.data.clients);
//     setCount(result.data.count);

//     setloading(false);
//   };

//   useEffect(() => {
//     const clients_array = data?.map((client) => ({
//       id: client._id, // Use client ID from clientsArrayRedux
//       name: client, // Assign the client ID to the 'client' field
//       status: client.personalInfo?.status, // Map the 'status' field
//       tags: client.personalInfo?.tags, // Map the 'email' field to 'primaryContact'
//       paymentMethods: "N/A", // Static value (you can modify as needed)
//       last_updated: client.personalInfo.activity.updatedAt
//     ? `${formatDate(client.personalInfo.activity.updatedAt)}`
//     : "No activity",
//       actions: client._id,
//     }));

//     setClientsArray(clients_array);
//     // console.log(clients_array, "gkhljgjkhg");
//   }, [data]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const [clientModalOpen, setClientModalOpen] = useState(false);
//   const handleClientModalOpen = () => setClientModalOpen(true);
//   const handleClientModalClose = () => setClientModalOpen(false);
//   const [editModalData, setEditModalData] = useState(null);
//   const editClient = (id) => {
//     const client = clientsArray.find((client) => client.id === id);
//     setEditModalData(client);
//     setClientModalOpen(true);
//   };
//   const CustomStatusCell = ({ value }) => {
//     // console.log(">>>>>", value);
//     const status = value?.toLowerCase();

//     return (
//       <Chip
//         label={value}
//         sx={{
//           bgcolor: getStatusColor(status),
//         }}
//         size="small"
//       />
//     );
//   };

//   const CustomTagComponent = ({ value }) => {
//     // console.log(value, "tags");

//     return (
//       <>
//         {value.map((val) => {
//           return (
//             <>
//               <Chip
//                 label={val}
//                 sx={{ bgcolor: "#0074BD", color: "white" ,marginRight:1 }}
//                 size="small"
//               />
//             </>
//           );
//         })}
//       </>
//     );
//   };

//   const CustomActionCell = ({ value }) => {
//     return (
//       <div className="flex items-center">
//         {/* { console.log(value,'sddsd')} */}
//         <IconButton size="small" onClick={() => editClient(value)}>
//           <Edit />
//         </IconButton>
//         <IconButton size="small" onClick={() => deleteClient(value)}>
//           <Delete />
//         </IconButton>
//       </div>
//     );
//   };
//   const CustomLastUpdated = ({ value }) => {
//     // Check if value is a Date object
//     if (value instanceof Date) {
//       // Options for date formatting
//       const options = {
//         month: "long", // Full month name
//         day: "numeric", // Numeric day
//         year: "numeric", // Full year
//         hour: "numeric", // Numeric hour
//         minute: "numeric", // Numeric minute
//         hour12: true, // 12-hour format with AM/PM
//       };

//       // Format the date object to a string
//       const formattedDate = value.toLocaleString("en-US", options);

//       return <div>{formattedDate}</div>;
//     }

//     // If the value is a string, show it as it is
//     return <div>{value}</div>;
//   };

//   const CustomNameCell = ({ value }) => {
//     console.log(value,'kkkk')
//     return <Link
//     to={`${value._id}`}

//     >{value.personalInfo?.name}</Link>;
//   };

//   const cellComponents = {
//     status: CustomStatusCell,
//     tags: CustomTagComponent,
//     actions: CustomActionCell,
//     last_updated: CustomLastUpdated,
//     name: CustomNameCell,
//   };

//   return (
//     <>
//       {/* <CreateClientModal
//         setClientsArray={setClientsArray}
//         open={clientModalOpen}
//         handleClose={handleClientModalClose}
//         data={editModalData}
//       /> */}
//       <div>
//         <Box sx={{ borderBottom: 1, borderColor: "#BFC6D4" }}>
//           <StyledTabs
//             value={tabValue}
//             onChange={handleTabChange}
//             variant={isSmall ? "scrollable" : "standard"}
//             scrollButtons
//             allowScrollButtonsMobile
//             aria-label="basic tabs example"
//           >
//             <StyledTab value="all" label="All" />
//             <StyledTab value="leads" label="Leads" />
//             <StyledTab value="active" label="Active" />
//             <StyledTab value="archived" label="Archived" />
//             <StyledTab value="inactive" label="Inactive" />
//           </StyledTabs>
//           <Box sx={{ borderBottom: 1, borderColor: "divider", mt: "-2px" }} />
//         </Box>
//         <div className="bg-white  p-4 flex flex-col gap-y-2">
//           <div className="flex  items-center justify-between flex-col md:flex-row gap-y-2">
//             <div className="flex gap-3">
//               <div className="left-search   flex items-center">
//                 <input
//                   type="text"
//                   className="border py-2 px-5 outline-none focus:border-black/30 rounded-full "
//                   placeholder="Search"
//                   // value={searchValue}
//                   // onChange={(e) => setsearchValue(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//           <p>{1} results</p>
//         </div>
//         <Box sx={{ marginTop: 2 }}>
//           {tabValue === "all" && (
//             <SimpleTable
//               columns={columns}
//               data={clientsArray}
//               cellComponents={cellComponents}
//             />
//           )}
//           {tabValue === "leads" && (
//             <SimpleTable
//               columns={columns}
//               data={clientsArrayFiltered}
//               cellComponents={cellComponents}
//             />
//           )}
//           {tabValue === "active" && (
//             <SimpleTable
//               columns={columns}
//               data={clientsArrayFiltered}
//               cellComponents={cellComponents}
//             />
//           )}
//           {tabValue === "archived" && (
//             <SimpleTable
//               columns={columns}
//               data={clientsArrayFiltered}
//               cellComponents={cellComponents}
//             />
//           )}
//           {tabValue === "inactive" && (
//             <SimpleTable
//               columns={columns}
//               data={clientsArrayFiltered}
//               cellComponents={cellComponents}
//             />
//           )}
//         </Box>
//       </div>
//     </>
//   );
// };

// export default ClientTabs;
