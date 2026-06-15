import React, { useEffect, useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import Loader from "../../../../components/ui/Loader";
import { Box, IconButton, Modal, FormControl, InputLabel, Select, MenuItem as MuiMenuItem } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaStore, FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddMemberModal from "../users/modals/AddMemberModal";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import MembersOverviewCard from "../../../../mui/MembersOverviewCard";
import manager from "../../../../../src/assets/construction/manager.png";
import Search from "../../../../../src/assets/construction/Search.png";
import AssignProjectManagerModal from "../../../../components/AssignProjectManagerModal";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";
import AssignMemberModal from "../../../../components/AssignMemberModal";
import AssignCAPModal from "../../../../components/AssignCAPModal";
import { useReadOnly } from "../../../../context/ReadOnlyContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  boxShadow: 24,
};

const SectionDetailPage = () => {
  const navigate = useNavigate();
  const isReadOnly = useReadOnly();
  const [showModal, setShowModal] = useState(false);
  const [openPMModal, setOpenPMModal] = useState(false);
  const [openStoreModal, setOpenStoreModal] = useState(false);
  const [openAssignPMModal, setOpenAssignPMModal] = useState(false);
  const [openAssignCMModal, setOpenAssignCMModal] = useState(false);
  const [openAssignStoreInchargeModal, setOpenAssignStoreInchargeModal] =
    useState(false);
  const [openAssignCAPModal, setOpenAssignCAPModal] = useState(false);
  const [unassignCMTarget, setUnassignCMTarget] = useState(null); // { assignmentId, name }
  const [unassignCMLoading, setUnassignCMLoading] = useState(false);
  const [unassignPMLoading, setUnassignPMLoading] = useState(false);
  const [selectedPM, setSelectedPM] = useState(null);
  const [selectedStoreHead, setSelectedStoreHead] = useState(null);

  // Section Store assignment for PM
  const [openAssignSectionStoreModal, setOpenAssignSectionStoreModal] = useState(false);
  const [sectionStores, setSectionStores] = useState([]);
  const [selectedSectionStoreId, setSelectedSectionStoreId] = useState("");
  const [sectionStoreLoading, setSectionStoreLoading] = useState(false);
  const [sectionStoreAssigning, setSectionStoreAssigning] = useState(false);
  const { id } = useParams();
  const [sectionData, setSectionData] = useState({});
  const [capData, setCapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

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

  const CustomActionComponent = ({ value: id }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        // {
        //   label: "View Detail",

        //     onClick: () => navigate(`/admin-dashboard/user-management/${id}`),
        //   icon: <FaUserEdit />,
        // },
        // {
        //   label: "Edit",
        //   onClick: () => alert("Edit"),
        //   icon: <FaUserEdit />,
        // },
        // {
        //   label: "Delete ",
        //   onClick: () => alert("Delete"),
        //   icon: <FaTrash />,
        // },
        {
          label: "Go to Store",
          onClick: () => {
            navigate(`/admin-dashboard/store/${id}`);
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
      to={`/admin-dashboard/store/${value?.id}`}
      className="underline text-primary"
    >
      {value?.name}
    </Link>
  );

  const CapActionComponent = ({ value: capId }) => {
    const handleDeleteCap = async () => {
      try {
        setModalLoading(true);
        const response = await apiClient.patch(`/material-caps/section/${id}`, {
          capId: capId,
          action: "delete",
        });

        if (response.ok) {
          toast.success("CAP deleted successfully!");
          fetchCAPData(); // Refresh the CAP table
        } else {
          toast.error("Failed to delete CAP");
        }
      } catch (error) {
        console.error("Error deleting CAP:", error);
        toast.error("Error deleting CAP");
      } finally {
        setModalLoading(false);
      }
    };

    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          ...(!isReadOnly ? [
            {
              label: "Delete",
              onClick: handleDeleteCap,
              icon: <FaTrash />,
            },
          ] : []),
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const CMUnassignButton = ({ row }) => {
    if (!row || isReadOnly) return null;
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

  const fetchSectionDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/sections/${id}`);
      if (response.ok) {
        setSectionData(response.data.section);
        setSelectedPM(
          response.data.section.associatedProjectManager?.user || null
        );
        const headStore = response.data.section.associatedHeadStores?.[0];
        setSelectedStoreHead(
          headStore?.storeInchargeAssignments?.[0]?.user || null
        );
      } else {
        toast.error("Failed to fetch Section details.");
      }
    } catch (error) {
      console.error("Error fetching Section details:", error);
      toast.error("Something went wrong while fetching details.");
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSectionDetail();
    }
  }, [id]);

  // Fetch CAP data for this section
  const fetchCAPData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/material-caps/section/${id}`);
      if (response.ok) {
        const caps = response.data.caps || [];
        // Transform data to include formatted dates
        const transformedCaps = caps.map((cap) => ({
          ...cap,
          createdAt: new Date(cap.createdAt).toLocaleDateString(),
        }));
        setCapData(transformedCaps);
      } else {
        toast.error("Failed to fetch CAP data");
      }
    } catch (error) {
      console.error("Error fetching CAP data:", error);
      toast.error("Error fetching CAP data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sectionData?.materialCapAnalytics) {
      console.log("Material CAP Analytics:", sectionData.materialCapAnalytics);
      setCapData(sectionData.materialCapAnalytics);
    } else if (id) {
      // Fetch CAP data if not available in sectionData
      fetchCAPData();
    }
  }, [sectionData, id]);

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  const handleAssignPM = (user) => {
    setSelectedPM(user);
    setOpenPMModal(false);
    fetchSectionDetail();
  };

  const handleAssignStoreHead = (user) => {
    setSelectedStoreHead(user);
    setOpenStoreModal(false);
    fetchSectionDetail();
  };

  const handleAddMember = async (data, type) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post("/auth/register", data);
      if (response.ok) {
        toast.success("Member added successfully!");
        fetchSectionDetail();
        if (type === "pm") setOpenPMModal(false);
        if (type === "store") setOpenStoreModal(false);
      } else {
        toast.error(response.data?.message || "Failed to add member");
      }
    } catch (error) {
      toast.error(error.message || "Error adding member");
    } finally {
      setModalLoading(false);
    }
  };

  const availableCMs = sectionData?.availableConstructionManagers || [];

  const handleAssignCM = async (user) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post(
        `/sections/${id}/assign-construction-manager`,
        { userId: user.id }
      );
      if (response.ok) {
        toast.success("Construction Manager assigned successfully!");
        fetchSectionDetail();
        setShowModal(false);
      } else {
        toast.error(
          response.data?.message || "Failed to assign Construction Manager"
        );
      }
    } catch (error) {
      toast.error(error.message || "Error assigning Construction Manager");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddCM = async (data) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post("/auth/register", {
        ...data,
        role: "CONSTRUCTION_MANAGER",
      });
      if (response.ok) {
        toast.success("Construction Manager added successfully!");
        await handleAssignCM(response.data.user);
        setShowModal(false);
        fetchSectionDetail();
      } else {
        toast.error(
          response.data?.message || "Failed to add Construction Manager"
        );
      }
    } catch (error) {
      toast.error(error.message || "Error adding Construction Manager");
    } finally {
      setModalLoading(false);
    }
  };

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

  const handleUnassignPM = async () => {
    const assignmentId = sectionData?.associatedProjectManager?.id;
    if (!assignmentId) return;
    try {
      setUnassignPMLoading(true);
      const response = await apiClient.patch(
        `/assignments/project-manager/${assignmentId}/deactivate`
      );
      if (response.ok) {
        toast.success("Project Manager unassigned successfully");
        setSelectedPM(null);
        fetchSectionDetail();
      } else {
        toast.error(response.data?.message || "Failed to unassign Project Manager");
      }
    } catch (e) {
      toast.error("Failed to unassign Project Manager");
    } finally {
      setUnassignPMLoading(false);
    }
  };

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

  const handleAssignCMGeneric = async ({ userId, storeIds = [], createStore = false }) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post(
        `/assignments/construction-manager`,
        { userId, sectionId: id, storeIds, createStore }
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

  const fetchCMStores = async () => {
    try {
      const response = await apiClient.get(`/stores`, { sectionId: id });
      if (response.ok && response.data?.stores) {
        return response.data.stores;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch stores");
      return [];
    }
  };

  const fetchStoreInchargeUsers = async () => {
    try {
      setModalLoading(true);
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
    } finally {
      setModalLoading(false);
    }
  };

  const createStoreInchargeUser = async (userData) => {
    try {
      setModalLoading(true);
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
    } finally {
      setModalLoading(false);
    }
  };

  const handleAssignStoreInchargeGeneric = async ({ userId }) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post(`/assignments/store-incharge`, {
        userId,
        storeId: sectionData?.headStore?.id,
      });
      if (response.ok) {
        toast.success("Store Incharge assigned successfully!");
        fetchSectionDetail();
        setOpenAssignStoreInchargeModal(false);
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

  const handleCAPSubmit = async (capItems) => {
    try {
      setModalLoading(true);

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

  return (
    <div className=" sm:p-6 w-full">
      <TopBar
        title="Section Details"
        showIcon={true}
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />

      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <InfoItem
            label="Project Name"
            value={sectionData?.project?.name || "-"}
          />
          <InfoItem
            label="Project Code"
            value={sectionData?.project?.code || "-"}
          />
          <InfoItem label="Section" value={sectionData?.name || "-"} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-4">
          {/* <InfoItem label="Project Status" value="project status" /> */}
          <InfoItem
            label="Total Amount"
            value={sectionData?.totalAmount || "0"}
          />
          <InfoItem
            label="Paid Amount"
            value={sectionData?.paidAmount || "0"}
          />
          <InfoItem
            label="Remaining Amount"
            value={sectionData?.remainingAmount || "0"}
          />
        </div>
      </div>

      <div className="mt-10">
        <h4 className="text-[#12141D] font-semibold text-xl mb-4">
          Members Overview
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Project Manager Card */}
          <div className="w-full relative">
            {loading ? (
              <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 bg-white min-h-[320px] flex items-center justify-center">
                <Loader />
              </div>
            ) : selectedPM ? (
              <div className="w-full [&_.border]:!w-full [&_.sm\\:w-\\[90\\%\\]]:!w-full [&_.md\\:w-\\[80\\%\\]]:!w-full [&_.lg\\:w-\\[60\\%\\]]:!w-full">
                <MemberInfoCard
                  title="General information - Project Manager"
                  image={manager}
                  name={selectedPM.name}
                  phone={selectedPM.phone || "-"}
                  role={formatText(selectedPM.role) || "Project Manager"}
                  email={selectedPM.email}
                  joiningDate={selectedPM.joiningDate || "-"}
                  id={selectedPM.id}
                  address={selectedPM.address || "-"}
                  country={selectedPM.country || "-"}
                  linkedStores={selectedPM.linkedStores || []}
                />
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <button
                    className="px-4 py-2 bg-[#FC8908] text-white rounded-lg hover:bg-[#e07c07] transition text-sm font-medium flex items-center gap-2"
                    onClick={async () => {
                      setOpenAssignSectionStoreModal(true);
                      setSelectedSectionStoreId("");
                      setSectionStoreLoading(true);
                      try {
                        const response = await apiClient.get(`/stores`, {
                          projectId: sectionData?.project?.id,
                          sectionId: id,
                          type: "SECTION_STORE",
                        });
                        if (response.ok && response.data?.stores) {
                          setSectionStores(response.data.stores);
                        } else {
                          setSectionStores([]);
                        }
                      } catch {
                        toast.error("Failed to fetch section stores");
                        setSectionStores([]);
                      } finally {
                        setSectionStoreLoading(false);
                      }
                    }}
                  >
                    <FaStore /> Assign Section Store
                  </button>
                  {!isReadOnly && (
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                      onClick={handleUnassignPM}
                      disabled={unassignPMLoading}
                    >
                      {unassignPMLoading ? "Unassigning..." : "Unassign PM"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <MembersOverviewCard
                title="General Information"
                subTitle="Project Manager"
                linkText="Assign Project Manager"
                imageSrc={Search}
                imageAlt="Search Illustration"
                onManagerClick={() => setOpenAssignPMModal(true)}
                className="!w-full !sm:w-full !md:w-full !lg:w-full"
              />
            )}
          </div>

          {/* Head Store Card - Improved Flow */}
          <div className="w-full relative">
            {loading ? (
              <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 bg-white min-h-[320px] flex items-center justify-center">
                <Loader />
              </div>
            ) : sectionData?.headStore ? (
              <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 bg-white min-h-[320px]">
                <div>
                  <h3 className="text-[#BF1017] text-lg sm:text-xl font-semibold mb-2">
                    Section Head Store
                  </h3>
                  <div className="mb-2">
                    <span className="font-semibold">Name:</span>{" "}
                    <Link
                      to={`/admin-dashboard/store/${sectionData.headStore.id}`}
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
                      {!isReadOnly && (
                        <button
                          className="mt-2 px-4 py-2 bg-[#BF1017] text-white rounded hover:bg-[#a00e13] transition"
                          onClick={() => setOpenAssignStoreInchargeModal(true)}
                        >
                          Assign Store Incharge
                        </button>
                      )}
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
      </div>

      <div className="mt-10">
        <TopBar title="Accountant" />

        <div className="overflow-x-auto mt-4 relative">

          {loading ? (
            <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
              <Loader />
            </div>
          ) : (
            <SimpleTable
              tableTitle="accountant"
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
            {...(!isReadOnly && {
              buttonText: "Add CM",
              onButtonClick: () => setOpenAssignCMModal(true),
            })}
          />

          <div className="overflow-x-auto mt-4 relative">
            {loading ? (
              <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
                <Loader />
              </div>
            ) : (
              <SimpleTable
              tableTitle="construction-managers"
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

        <div className="mt-10">
          <TopBar
            title="Material CAP"
            {...(!isReadOnly && {
              buttonText: "Add Material Cap",
              onButtonClick: () => setOpenAssignCAPModal(true),
            })}
          />
          <div className="overflow-x-auto mt-4 relative">
            {loading ? (
              <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
                <Loader />
              </div>
            ) : (
              <SimpleTable
              tableTitle="cap"
                data={capData}
                columns={capColumns}
                cellComponents={{
                  id: CapActionComponent,
                  capQuantity: CapQuantityComponent,
                  status: StatusComponent,
                }}
              />
            )}
          </div>
        </div>
      </div>

      <AssignMemberModal
        role="Project Manager"
        open={openAssignPMModal}
        onClose={() => setOpenAssignPMModal(false)}
        fetchUsers={fetchPMUsers}
        createUser={createPMUser}
        onAssign={handleAssignPMGeneric}
        loading={modalLoading}
      />

      <Modal open={openStoreModal} onClose={() => setOpenStoreModal(false)}>
        <Box sx={style}>
          <AssignProjectManagerModal
            onManagerClick={handleAssignStoreHead}
            onCreateClick={() => setShowModal(true)}
          />
        </Box>
      </Modal>

      <AssignMemberModal
        role="Construction Manager"
        open={openAssignCMModal}
        onClose={() => setOpenAssignCMModal(false)}
        fetchUsers={fetchCMUsers}
        createUser={createCMUser}
        onAssign={handleAssignCMGeneric}
        fetchStores={fetchCMStores}
        askCreateStore
        loading={modalLoading}
      />

      <AssignMemberModal
        role="Store Incharge"
        open={openAssignStoreInchargeModal}
        onClose={() => setOpenAssignStoreInchargeModal(false)}
        fetchUsers={fetchStoreInchargeUsers}
        createUser={createStoreInchargeUser}
        onAssign={handleAssignStoreInchargeGeneric}
        loading={modalLoading}
      />

      <AssignCAPModal
        open={openAssignCAPModal}
        onClose={() => setOpenAssignCAPModal(false)}
        onSubmit={handleCAPSubmit}
        loading={modalLoading}
        sectionId={id}
        onCapDeleted={fetchCAPData}
      />

      {/* Assign Section Store to PM Modal */}
      <Modal
        open={openAssignSectionStoreModal}
        onClose={() => setOpenAssignSectionStoreModal(false)}
      >
        <Box
          sx={style}
          className="bg-white p-6 rounded-2xl"
        >
          <h2 className="text-lg font-bold mb-4">
            Assign Section Store to {selectedPM?.name || "Project Manager"}
          </h2>
          {sectionStoreLoading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : sectionStores.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">
              No section stores found for this section.
            </p>
          ) : (
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel>Select Section Store</InputLabel>
              <Select
                value={selectedSectionStoreId}
                onChange={(e) => setSelectedSectionStoreId(e.target.value)}
                label="Select Section Store"
              >
                {sectionStores.map((store) => (
                  <MuiMenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setOpenAssignSectionStoreModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!selectedSectionStoreId || !selectedPM?.id) return;
                try {
                  setSectionStoreAssigning(true);
                  const response = await apiClient.post(
                    `/stores/${selectedSectionStoreId}/assign-project-manager`,
                    { userId: selectedPM.id }
                  );
                  if (response.ok) {
                    toast.success("Section Store assigned to PM");
                    setOpenAssignSectionStoreModal(false);
                    fetchSectionDetail();
                  } else {
                    toast.error(
                      response.data?.message || "Failed to assign section store"
                    );
                  }
                } catch {
                  toast.error("Failed to assign section store");
                } finally {
                  setSectionStoreAssigning(false);
                }
              }}
              disabled={!selectedSectionStoreId || sectionStoreAssigning}
              className="px-4 py-2 bg-[#FC8908] text-white rounded-lg hover:bg-[#e07c07] transition disabled:opacity-50"
            >
              {sectionStoreAssigning ? "Assigning..." : "Assign"}
            </button>
          </div>
        </Box>
      </Modal>

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

const InfoItem = ({ label, value }) => (
  <div className="flex items-start sm:flex-row gap-1 sm:gap-2">
    <p className="text-[#444444] font-semibold text-base whitespace-nowrap">
      {label}:
    </p>
    <p className="text-[#979797] text-sm break-words flex justify-center items-center">
      {value}
    </p>
  </div>
);

export default SectionDetailPage;
