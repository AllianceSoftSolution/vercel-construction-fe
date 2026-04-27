import React, { useState, useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import ProjectInfoCard from "../../../../components/ui/ProjectInfoCard";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaUserEdit, FaStore } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { useNavigate, useParams, Link } from "react-router-dom";
import AddMemberModal from "../users/modals/AddMemberModal";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import MemebersOverviewCard from "../../../../mui/MembersOverviewCard";
import manager from "../../../../../src/assets/construction/manager.png";
import Search from "../../../../../src/assets/construction/Search.png";
import AssignProjectManagerModal from "../../../../components/AssignProjectManagerModal";
import AssignMemberModal from "../../../../components/AssignMemberModal";
import AssignCAPModal from "../../../../components/AssignCAPModal";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
// import Loader from "../../../../components/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 600,
  boxShadow: 24,
};

const SiSectionDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [openAssignCMModal, setOpenAssignCMModal] = useState(false);
  const [openAssignCAPModal, setOpenAssignCAPModal] = useState(false);
  const [openAssignStoreInchargeModal, setOpenAssignStoreInchargeModal] = useState(false);
  const [capData, setCapData] = useState([]);
  const [capDataType, setCapDataType] = useState("analytics"); // "analytics" or "raw"
  const [unassignCMTarget, setUnassignCMTarget] = useState(null); // { assignmentId, name }
  const [unassignCMLoading, setUnassignCMLoading] = useState(false);

  // Generic function to format text for display (roles, types, etc.)
  const formatText = (text) => {
    if (!text) return "-";

    // Convert text to title case and replace underscores with spaces
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get section manager
  const getSectionManager = () => {
    if (
      !sectionData?.constructionManagerAssignments ||
      sectionData.constructionManagerAssignments.length === 0
    ) {
      return "Not assigned";
    }
    return (
      sectionData.constructionManagerAssignments[0].user?.name || "Unknown"
    );
  };

  // Get store incharge assignments
  const getStoreInchargeAssignments = () => {
    if (!sectionData?.stores) return [];

    const assignments = [];
    sectionData.stores.forEach((store) => {
      if (
        store.storeInchargeAssignments &&
        store.storeInchargeAssignments.length > 0
      ) {
        store.storeInchargeAssignments.forEach((assignment) => {
          assignments.push({
            user: assignment.user,
            store: store,
          });
        });
      }
    });

    return assignments;
  };

  // Transform construction managers data
  const transformConstructionManagersData = () => {
    if (!sectionData?.associatedConstructionManagers) return [];
    return sectionData.associatedConstructionManagers.map(
      (assignment, index) => ({
        id: assignment.user?.id || index,
        cmId: (index + 1).toString().padStart(2, "0"),
        constructionManager: assignment.user?.name || "Unknown",
        email: assignment.user?.email || "No email",
        phone: assignment.user?.phone || "Not available",
        address: assignment.user?.address || "Not available",
        status: assignment.isActive ? "Active" : "Inactive",
        date: formatDate(assignment.createdAt),
        action: assignment.user?.id || index,
      })
    );
  };

  const fetchSectionDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/sections/${id}`);
      if (response.ok) {
        setSectionData(response.data.section);
      } else {
        toast.error("Failed to fetch section details.");
      }
    } catch (error) {
      console.error("Error fetching section details:", error);
      toast.error("Something went wrong while fetching details.");
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  // CAP submission handler
  const handleCAPSubmit = async (capItems) => {
    try {
      setModalLoading(true);

      // Transform the data to match the API structure
      const transformedItems = capItems.map((item) => ({
        materialId: item.materialId,
        quantity: parseInt(item.qty) || 0,
        unit: item.unit,
      }));

      console.log("Original CAP items:", capItems);
      console.log("Transformed items:", transformedItems);

      // Call the new API endpoint
      console.log("Sending CAP data:", { caps: transformedItems });
      const response = await apiClient.post(`/material-caps/section/${id}`, {
        caps: transformedItems,
      });

      console.log("API Response:", response);

      if (response.ok) {
        toast.success("CAP items added successfully!");
        setOpenAssignCAPModal(false);
        // Refresh section data to get updated materialCapAnalytics
        fetchSectionDetail();
      } else {
        console.error("API Error:", response.data);
        toast.error(response.data?.message || "Failed to add CAP items");
      }
    } catch (error) {
      console.error("Error adding CAP items:", error);
      toast.error("Failed to add CAP items");
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSectionDetail();
  }, [id]);

  // Fetch CAP data for this section
  const fetchCAPData = async () => {
    try {
      setLoading(true);
      console.log("Fetching CAP data for section:", id);
      const response = await apiClient.get(`/material-caps/section/${id}`);
      console.log("CAP API Response:", response);

      if (response.ok) {
        const caps = response.data.caps || [];
        console.log("Raw CAP data:", caps);

        // Transform data to include formatted dates
        const transformedCaps = caps.map((cap) => ({
          ...cap,
          createdAt: new Date(cap.createdAt).toLocaleDateString(),
        }));
        console.log("Transformed CAP data:", transformedCaps);
        setCapData(transformedCaps);
      } else {
        console.error("CAP API Error:", response.data);
        toast.error("Failed to fetch CAP data");
      }
    } catch (error) {
      console.error("Error fetching CAP data:", error);
      toast.error("Error fetching CAP data");
    } finally {
      setLoading(false);
    }
  };

  // Update CAP data when section data changes
  useEffect(() => {
    if (sectionData?.materialCapAnalytics) {
      console.log("Material CAP Analytics:", sectionData.materialCapAnalytics);
      setCapData(sectionData.materialCapAnalytics);
      setCapDataType("analytics");
    } else if (id) {
      // Fetch CAP data if not available in sectionData
      fetchCAPData();
      setCapDataType("raw");
    }
  }, [sectionData, id]);

  // Debug: Log capData whenever it changes
  useEffect(() => {
    console.log("CAP Data updated:", capData);
  }, [capData]);

  // Construction Manager assignment logic
  const fetchCMUsers = async () => {
    try {
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: "CONSTRUCTION_MANAGER",
        projectId: sectionData?.project?.id,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const createCMUser = async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: "CONSTRUCTION_MANAGER",
      });
      if (response.ok && response.data?.user) {
        toast.success("User created successfully");
        return response.data.user;
      }
      toast.error(response.data?.message || "Failed to create user");
      return null;
    } catch (e) {
      toast.error("Failed to create user");
      return null;
    }
  };

  // PM assignment functions
  const fetchPMUsers = async () => {
    try {
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: "PROJECT_MANAGER",
        projectId: sectionData?.project?.id,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const createPMUser = async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: "PROJECT_MANAGER",
      });
      if (response.ok && response.data?.user) {
        toast.success("User created successfully");
        return response.data.user;
      }
      toast.error(response.data?.message || "Failed to create user");
      return null;
    } catch (e) {
      toast.error("Failed to create user");
      return null;
    }
  };

  // Store Incharge assignment functions
  const fetchStoreInchargeUsers = async () => {
    try {
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: "STORE_INCHARGE",
        projectId: sectionData?.project?.id,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const createStoreInchargeUser = async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: "STORE_INCHARGE",
      });
      if (response.ok && response.data?.user) {
        toast.success("User created successfully");
        return response.data.user;
      }
      toast.error(response.data?.message || "Failed to create user");
      return null;
    } catch (e) {
      toast.error("Failed to create user");
      return null;
    }
  };

  const handleAssignPMGeneric = async ({ userId }) => {
    try {
      const response = await apiClient.post(`/assignments/project-manager`, {
        userId,
        projectId: sectionData?.project?.id,
        sectionId: sectionData?.id,
      });
      if (response.ok) {
        toast.success("Project Manager assigned successfully");
        setOpenAssignPMModal(false);
        fetchSectionDetail();
        return true;
      } else {
        toast.error(
          response.data?.message || "Failed to assign Project Manager"
        );
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign Project Manager");
      return false;
    }
  };

  const handleAssignCMGeneric = async ({ userId }) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post(
        `/assignments/construction-manager`,
        { userId, sectionId: id }
      );
      if (response.ok) {
        toast.success("Construction Manager assigned successfully!");
        setOpenAssignCMModal(false);
        fetchSectionDetail();
        return true;
      } else {
        toast.error(
          response.data?.message || "Failed to assign Construction Manager"
        );
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign Construction Manager");
      return false;
    } finally {
      setModalLoading(false);
    }
  };

  const handleUnassignCM = async () => {
    if (!unassignCMTarget) return;
    try {
      setUnassignCMLoading(true);
      const response = await apiClient.patch(
        `/assignments/construction-manager/${unassignCMTarget.assignmentId}/deactivate`
      );
      if (response.ok) {
        toast.success("Construction Manager unassigned. Stock transferred to head store.");
        setUnassignCMTarget(null);
        fetchSectionDetail();
      } else {
        toast.error(response.data?.message || "Failed to unassign Construction Manager");
      }
    } catch (e) {
      toast.error("Failed to unassign Construction Manager");
    } finally {
      setUnassignCMLoading(false);
    }
  };

  const handleAssignStoreInchargeGeneric = async ({ userId }) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post(
        `/assignments/store-incharge`,
        { 
          userId, 
          sectionId: id,
          storeId: sectionData?.headStore?.id 
        }
      );
      if (response.ok) {
        toast.success("Store Incharge assigned successfully!");
        setOpenAssignStoreInchargeModal(false);
        fetchSectionDetail();
        return true;
      } else {
        toast.error(
          response.data?.message || "Failed to assign Store Incharge"
        );
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign Store Incharge");
      return false;
    } finally {
      setModalLoading(false);
    }
  };

  const CustomActionComponent = ({ value: id }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail",
          onClick: () =>
            navigate(`/siteincharge-dashboard/user-management/${id}`),
          icon: <FaUserEdit />,
        },
        {
          label: "Go to Store",
          onClick: () => {
            navigate(`/siteincharge-dashboard/store/${id}`);
          },
          icon: <FaStore />,
        },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  const CustomStoreLinkComponent = ({ value }) => (
    <Link
      to={`/siteincharge-dashboard/store/${value?.id}`}
      className="underline text-primary"
    >
      {value?.name}
    </Link>
  );

  const CMUnassignButton = ({ row }) => {
    if (!row) return null;
    return (
      <button
        onClick={() => setUnassignCMTarget({ assignmentId: row.id, name: row.user?.name || "this CM" })}
        className="px-3 py-1 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
      >
        Unassign
      </button>
    );
  };

  const columns = [
    // { headerName: "CM ID", field: "id" },
    { headerName: "Name", field: "user.name" },
    { headerName: "Email", field: "user.email" },
    // { headerName: "Phone Number", field: "user.phone" },
    // { headerName: "Address", field: "user.address" },
    { headerName: "Created By", field: "user.creator.name" },
    { headerName: "CM Store", field: "cmStore" },
    { headerName: "Action", field: "action" },
  ];

  const columnsAcc = [
    { headerName: "Name", field: "user.name" },
    { headerName: "Email", field: "user.email" },
    { headerName: "Role", field: "user.role" },
  ];
  const capColumns = [
    { headerName: "Material Name", field: "materialName" },
    { headerName: "CAP Quantity", field: "capQuantity" },
    { headerName: "Unit", field: "capUnit" },
    { headerName: "Demand Quantity", field: "totalDemandQuantity" },
    { headerName: "PO Quantity", field: "totalPurchaseOrderQuantity" },
    { headerName: "Status", field: "status" },
    // { headerName: "Action", field: "materialId" },
  ];

  // For raw CAP data (different field structure)
  const rawCapColumns = [
    { headerName: "Material Name", field: "material.name" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Section", field: "section.name" },
    { headerName: "Project", field: "project.name" },
    { headerName: "Created At", field: "createdAt" },
  ];

  const CapQuantityComponent = ({ value, row }) => {
    if (!row) {
      return <span>{value}</span>;
    }

    const capQuantity = row.capQuantity || 0;
    const demandQuantity = row.totalDemandQuantity || 0;
    const poQuantity = row.totalPurchaseOrderQuantity || 0;

    // Check if demand quantity exceeds cap quantity
    const isDemandExceeded = demandQuantity > capQuantity;
    // Check if PO quantity exceeds cap quantity
    const isPOExceeded = poQuantity > capQuantity;

    let textColor = "text-green-600 font-semibold"; // Default green

    if (isDemandExceeded || isPOExceeded) {
      textColor = "text-red-600 font-semibold"; // Red if either exceeds
    }

    return <span className={textColor}>{value}</span>;
  };

  // Custom cell renderer for status with chips
  const StatusComponent = ({ value, row }) => {
    // If row is undefined, we'll work with just the value
    const getStatusInfo = (status) => {
      // Map status strings to display info
      switch (status) {
        case "WITHIN_LIMIT":
          return { text: "Within Limit", color: "bg-green-100 text-green-800" };
        case "DEMAND_EXCEEDED":
          return {
            text: "Demand Exceeded",
            color: "bg-orange-100 text-orange-800",
          };
        case "PO_EXCEEDED":
          return {
            text: "PO Exceeded",
            color: "bg-yellow-100 text-yellow-800",
          };
        case "BOTH_EXCEEDED":
          return { text: "Both Exceeded", color: "bg-red-100 text-red-800" };
        case "PENDING":
          return { text: "Pending", color: "bg-gray-100 text-gray-800" };
        case "INACTIVE":
          return { text: "Inactive", color: "bg-gray-100 text-gray-600" };
        default:
          return {
            text: status || "Unknown",
            color: "bg-gray-100 text-gray-800",
          };
      }
    };

    const statusInfo = getStatusInfo(value);

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  // Remove hardcoded data - we'll use capData from API

  const [showModal, setShowModal] = useState(false);
  const [hasMemberInfo, setHasMemberInfo] = useState(false);
  const [hasStoreHeadInfo, setHasStoreHeadInfo] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAssignPMModal, setOpenAssignPMModal] = useState(false);

  const constructionManagersData = transformConstructionManagersData();
  const storeIncharges = getStoreInchargeAssignments();

  // Show page loader until initial data is loaded
  if (pageLoading) {
    return (
      <div className="px-4 md:px-8 py-4">
        <TopBar
          title="Section Details"
          // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading section details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-4">
      <TopBar
        title="Section Details"
        showIcon={true}
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading section details...</p>
        </div>
      ) : sectionData ? (
        <>
          {/* Section Info */}
          <div className="bg-[#F7F7F7] rounded-md mt-4 p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-wrap sm:flex-row gap-8">
              <InfoPair label="Section Name" value={sectionData.name || "Not available"} />
              <InfoPair label="Section Code" value={sectionData.code || "Not available"} />
              <InfoPair label="Project Name" value={sectionData.project?.name || "Not available"} />
              {/* <InfoPair label="Construction Manager" value={getSectionManager()} />
              <InfoPair label="Created Date" value={formatDate(sectionData.createdAt)} />
              <InfoPair label="Status" value={sectionData.isActive ? "Active" : "Inactive"} />
              <InfoPair label="Linked Stores" value={sectionData.stores?.length || 0} /> */}
            </div>
            {/* {sectionData.description && (
              <div className="mt-2">
                <InfoPair label="Description" value={sectionData.description} />
              </div>
            )} */}
          </div>

          {/* Member Cards */}
          <h4 className="mt-10 text-[#12141D] font-semibold text-xl">
            Members Overview
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-4">
                         {/* Project Manager Card */}
             <div className="w-full">
               {sectionData?.associatedProjectManager ? (
                 <div className="w-full">
                   <MemberInfoCard
                     title="General information - Project Manager"
                     image={manager}
                     name={sectionData.associatedProjectManager.user?.name || "Unknown"}
                    //  phone={sectionData.associatedProjectManager.user?.phone || "-"}
                     role={formatText(sectionData.associatedProjectManager.user?.role) || "Project Manager"}
                     email={sectionData.associatedProjectManager.user?.email || "-"}
                    //  joiningDate={sectionData.associatedProjectManager.user?.createdAt ? new Date(sectionData.associatedProjectManager.user.createdAt).toLocaleDateString() : "-"}
                    //  id={sectionData.associatedProjectManager.user?.id || "-"}
                    //  address={sectionData.associatedProjectManager.user?.address || "-"}
                    //  country={sectionData.associatedProjectManager.user?.country || "-"}
                    //  linkedStores={[sectionData.associatedProjectManager.cmStore?.name || "-"]}
                   />
                 </div>
               ) : (
                <div className="w-full [&_.border]:!w-full [&_.sm\\:w-\\[90\\%\\]]:!w-full [&_.md\\:w-\\[80\\%\\]]:!w-full [&_.lg\\:w-\\[60\\%\\]]:!w-full">
                  <MemebersOverviewCard
                    title="General Information"
                    subTitle="Project Manager"
                    linkText="Assign Project Manager"
                    imageSrc={Search}
                    imageAlt="Search Illustration"
                    onManagerClick={() => setOpenAssignPMModal(true)}
                    className="!w-full !sm:w-full !md:w-full !lg:w-full"
                  />
                </div>
              )}
            </div>
            {/* Head Store Card */}
            <div className="w-full">
              {sectionData?.headStore ? (
                <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 bg-white min-h-[320px] w-full">
                  <div>
                    <h3 className="text-[#BF1017] text-lg sm:text-xl font-semibold mb-2">
                      Section Head Store
                    </h3>
                    <div className="mb-2">
                      <span className="font-semibold">Name:</span>{" "}
                      <Link
                        to={`/siteincharge-dashboard/store/${sectionData.headStore.id}`}
                        className="underline text-primary"
                      >
                        {sectionData.headStore.name}
                      </Link>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Type:</span>{" "}
                      {formatText(sectionData.headStore.type)}
                    </div>
                  </div>
                  {/* Store Incharge Section */}
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-base mb-2">
                      Store Incharge
                    </h4>
                    {sectionData.headStore.storeInchargeAssignments &&
                    sectionData.headStore.storeInchargeAssignments.length > 0 &&
                    sectionData.headStore.storeInchargeAssignments[0].user ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Name:</span>
                          <span>
                            {
                              sectionData.headStore.storeInchargeAssignments[0]
                                .user.name
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Email:</span>
                          <span>
                            {sectionData.headStore.storeInchargeAssignments[0]
                              .user.email || "-"}
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <span className="font-semibold">Phone:</span>
                          <span>
                            {sectionData.headStore.storeInchargeAssignments[0]
                              .user.phone || "-"}
                          </span>
                        </div> */}
                        {/* <div className="flex items-center gap-2">
                          <span className="font-semibold">Joining Date:</span>
                          <span>
                            {sectionData.headStore.storeInchargeAssignments[0]
                              .user.joiningDate
                              ? new Date(
                                  sectionData.headStore.storeInchargeAssignments[0].user.joiningDate
                                ).toLocaleDateString()
                              : "-"}
                          </span>
                        </div> */}
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Role:</span>
                          <span>
                            {formatText(
                              sectionData.headStore.storeInchargeAssignments[0]
                                .user.role
                            ) || "Store Incharge"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-2">
                        <span className="text-[#979797]">
                          No Store Incharge assigned.
                        </span>
                        <button
                          className="mt-2 px-4 py-2 bg-[#BF1017] text-white rounded hover:bg-[#a00e13] transition"
                          onClick={() => setOpenAssignStoreInchargeModal(true)}
                        >
                          Assign Store Incharge
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 bg-white min-h-[320px] w-full flex items-center justify-center">
                  <span className="text-[#979797] text-base">
                    No Head Store assigned to this section.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stores Information */}
          {sectionData.stores && sectionData.stores.length > 0 && (
            <div className="mt-10">
              <TopBar
                title="Linked Stores"
                detail="Stores associated with this section."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {sectionData.stores.map((store) => (
                  <div
                    key={store.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-lg">{store.name}</h5>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          store.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {store.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Type: {formatText(store.type)}
                    </p>
                    {store.storeInchargeAssignments &&
                      store.storeInchargeAssignments.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Store Incharge:</span>
                          <div className="mt-1">
                            {store.storeInchargeAssignments.map(
                              (assignment, index) => (
                                <div key={index} className="text-gray-600">
                                  • {assignment.user?.name} (
                                  {assignment.user?.email})
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CM Table */}
          <div className="mt-10">
            <TopBar title="Accountant" />

            <div className="overflow-x-auto mt-4 relative">
              {loading ? (
                <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
                  {/* <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> */}
                </div>
              ) : (
                <SimpleTable
                  data={sectionData?.associatedAccountants || []}
                  columns={columnsAcc}
                  cellComponents={{}}
                />
              )}
            </div>
            <div className="mt-10">
              <TopBar
                title="Construction Managers"
                // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                buttonText="Add CM"
                onButtonClick={() => setOpenAssignCMModal(true)}
              />

              <div className="overflow-x-auto mt-4 relative">
                {loading ? (
                  <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <SimpleTable
                    data={sectionData?.associatedConstructionManagers || []}
                    columns={columns}
                    cellComponents={{
                      cmStore: CustomStoreLinkComponent,
                      action: CMUnassignButton,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

            <div className="mt-10">
          <TopBar
            title="Material CAP"
            buttonText="Add Material Cap"
            onButtonClick={() => setOpenAssignCAPModal(true)}
          />
          <div className="overflow-x-auto mt-4 relative">
            {loading ? (
              <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
                {/* <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> */}
              </div>
            ) : (
              <SimpleTable
                data={capData}
                columns={capDataType === "analytics" ? capColumns : rawCapColumns}
                cellComponents={{ 
                  id: CustomActionComponent,
                  capQuantity: capDataType === "analytics" ? CapQuantityComponent : undefined,
                  status: StatusComponent
                }}
              />
            )}
          </div>
        </div>

          {/* AssignMemberModal for Project Manager */}
          <AssignMemberModal
            role="Project Manager"
            open={openAssignPMModal}
            onClose={() => setOpenAssignPMModal(false)}
            fetchUsers={fetchPMUsers}
            createUser={createPMUser}
            onAssign={handleAssignPMGeneric}
            loading={modalLoading}
          />

          {/* AssignMemberModal for Construction Manager */}
          <AssignMemberModal
            role="Construction Manager"
            open={openAssignCMModal}
            onClose={() => setOpenAssignCMModal(false)}
            fetchUsers={fetchCMUsers}
            createUser={createCMUser}
            onAssign={handleAssignCMGeneric}
            loading={modalLoading}
          />

          {/* AssignCAPModal for CAP items */}
          <AssignCAPModal
            open={openAssignCAPModal}
            onClose={() => setOpenAssignCAPModal(false)}
            onSubmit={handleCAPSubmit}
            loading={modalLoading}
            sectionId={id}
            onCapDeleted={fetchCAPData}
          />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Section not found or failed to load.</p>
        </div>
      )}

      {/* Unassign CM Confirmation Modal */}
      {unassignCMTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#043b6a] mb-2">
              Unassign Construction Manager
            </h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to unassign{" "}
              <strong>{unassignCMTarget.name}</strong> from this section?
            </p>
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5">
              ⚠️ Any stock in the CM store will be automatically transferred back to the Head Store before unassigning.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setUnassignCMTarget(null)}
                disabled={unassignCMLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUnassignCM}
                disabled={unassignCMLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {unassignCMLoading ? "Unassigning..." : "Unassign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoPair = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
    <p className="text-[#444444] font-semibold text-sm sm:text-base">
      {label}:
    </p>
    <p className="text-[#979797] text-sm sm:text-base">{value}</p>
  </div>
);

export default SiSectionDetailPage;
