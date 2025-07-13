import React, { useState, useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import ProjectInfoCard from "../../../../components/ui/ProjectInfoCard";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { useNavigate, useParams } from "react-router-dom";
import AddMemberModal from "../users/modals/AddMemberModal";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import MemebersOverviewCard from "../../../../mui/MembersOverviewCard";
import manager from "../../../../../src/assets/construction/manager.png";
import Search from "../../../../../src/assets/construction/Search.png";
import AssignProjectManagerModal from "../../../../components/AssignProjectManagerModal";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

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

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get section manager
  const getSectionManager = () => {
    if (!sectionData?.constructionManagerAssignments || sectionData.constructionManagerAssignments.length === 0) {
      return "Not assigned";
    }
    return sectionData.constructionManagerAssignments[0].user?.name || "Unknown";
  };

  // Get store incharge assignments
  const getStoreInchargeAssignments = () => {
    if (!sectionData?.stores) return [];
    
    const assignments = [];
    sectionData.stores.forEach(store => {
      if (store.storeInchargeAssignments && store.storeInchargeAssignments.length > 0) {
        store.storeInchargeAssignments.forEach(assignment => {
          assignments.push({
            user: assignment.user,
            store: store
          });
        });
      }
    });
    
    return assignments;
  };

  // Transform construction managers data
  const transformConstructionManagersData = () => {
    if (!sectionData?.constructionManagerAssignments) return [];
    
    return sectionData.constructionManagerAssignments.map((assignment, index) => ({
      id: assignment.user?.id || index,
      cmId: (index + 1).toString().padStart(2, '0'),
      constructionManager: assignment.user?.name || "Unknown",
      email: assignment.user?.email || "No email",
      phone: "Not available", // Phone not in API response
      address: "Not available", // Address not in API response
      status: "Active", // Status not in API response
      date: formatDate(sectionData.createdAt),
      action: assignment.user?.id || index,
    }));
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
    }
  };

  useEffect(() => {
    if (id) fetchSectionDetail();
  }, [id]);

  const CustomActionComponent = ({ value: memberId }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail",
          onClick: () =>
            navigate(`/siteincharge-dashboard/user-management/${memberId}`),
          icon: <FaUserEdit />,
        },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  const columns = [
    { headerName: "CM ID", field: "cmId" },
    { headerName: "Construction Manager", field: "constructionManager" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone" },
    { headerName: "Address", field: "address" },
    { headerName: "Status", field: "status" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [hasMemberInfo, setHasMemberInfo] = useState(false);
  const [hasStoreHeadInfo, setHasStoreHeadInfo] = useState(false);
  const [open, setOpen] = useState(false);

  const constructionManagersData = transformConstructionManagersData();
  const storeIncharges = getStoreInchargeAssignments();

  return (
    <div className="px-4 md:px-8 py-4">
      <TopBar
        title="Section Details"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
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
            <div className="flex flex-col sm:flex-wrap sm:flex-row gap-4">
              <InfoPair label="Section Name" value={sectionData.name || "Not available"} />
              <InfoPair label="Section Code" value={sectionData.code || "Not available"} />
              <InfoPair label="Project Name" value={sectionData.project?.name || "Not available"} />
              <InfoPair label="Construction Manager" value={getSectionManager()} />
              <InfoPair label="Created Date" value={formatDate(sectionData.createdAt)} />
              <InfoPair label="Status" value={sectionData.isActive ? "Active" : "Inactive"} />
              <InfoPair label="Linked Stores" value={sectionData.stores?.length || 0} />
            </div>
            {sectionData.description && (
              <div className="mt-2">
                <InfoPair label="Description" value={sectionData.description} />
              </div>
            )}
          </div>

          {/* Member Cards */}
          <h4 className="mt-10 text-[#12141D] font-semibold text-xl">
            Members Overview
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-4">
            {/* Construction Manager Card */}
            <div className="w-full">
              {sectionData?.associatedConstructionManagers && sectionData.associatedConstructionManagers.length > 0 ? (
                <div className="w-full">
                  <MemberInfoCard
                    title="General information - Construction Manager"
                    image={manager}
                    name={sectionData.associatedConstructionManagers[0].user?.name || "Unknown"}
                    phone={sectionData.associatedConstructionManagers[0].user?.phone || "-"}
                    role={sectionData.associatedConstructionManagers[0].user?.role || "Construction Manager"}
                    email={sectionData.associatedConstructionManagers[0].user?.email || "-"}
                    joiningDate={sectionData.associatedConstructionManagers[0].user?.createdAt ? new Date(sectionData.associatedConstructionManagers[0].user.createdAt).toLocaleDateString() : "-"}
                    id={sectionData.associatedConstructionManagers[0].user?.id || "-"}
                    address={sectionData.associatedConstructionManagers[0].user?.address || "-"}
                    country={sectionData.associatedConstructionManagers[0].user?.country || "-"}
                    linkedStores={[sectionData.associatedConstructionManagers[0].cmStore?.name || "-"]}
                  />
                </div>
              ) : (
                <div className="w-full">
                  <MemebersOverviewCard
                    title="General Information"
                    subTitle="Construction Manager"
                    linkText="Assign Construction Manager"
                    imageSrc={Search}
                    imageAlt="Search Illustration"
                    onManagerClick={() => setHasMemberInfo(true)}
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
                      Head Store
                    </h3>
                    <div className="mb-2">
                      <span className="font-semibold">Name:</span> {sectionData.headStore.name}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Type:</span> {sectionData.headStore.type}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">ID:</span> {sectionData.headStore.id}
                    </div>
                  </div>
                  {/* Store Incharge Section */}
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-base mb-2">Store Incharge</h4>
                    {sectionData.headStore.storeInchargeAssignments &&
                    sectionData.headStore.storeInchargeAssignments.length > 0 &&
                    sectionData.headStore.storeInchargeAssignments[0].user ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Name:</span>
                          <span>{sectionData.headStore.storeInchargeAssignments[0].user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Email:</span>
                          <span>{sectionData.headStore.storeInchargeAssignments[0].user.email || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Phone:</span>
                          <span>{sectionData.headStore.storeInchargeAssignments[0].user.phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Joining Date:</span>
                          <span>{sectionData.headStore.storeInchargeAssignments[0].user.joiningDate ? new Date(sectionData.headStore.storeInchargeAssignments[0].user.joiningDate).toLocaleDateString() : "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Role:</span>
                          <span>{sectionData.headStore.storeInchargeAssignments[0].user.role || "Store Incharge"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-2">
                        <span className="text-[#979797]">No Store Incharge assigned.</span>
                        <button
                          className="mt-2 px-4 py-2 bg-[#BF1017] text-white rounded hover:bg-[#a00e13] transition"
                          onClick={() => setHasStoreHeadInfo(true)}
                        >
                          Assign Store Incharge
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 bg-white min-h-[320px] w-full flex items-center justify-center">
                  <span className="text-[#979797] text-base">No Head Store assigned to this section.</span>
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
                  <div key={store.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-lg">{store.name}</h5>
                      <span className={`px-2 py-1 rounded text-xs ${
                        store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {store.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Type: {store.type?.replace(/_/g, ' ')}
                    </p>
                    {store.storeInchargeAssignments && store.storeInchargeAssignments.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Store Incharge:</span>
                        <div className="mt-1">
                          {store.storeInchargeAssignments.map((assignment, index) => (
                            <div key={index} className="text-gray-600">
                              • {assignment.user?.name} ({assignment.user?.email})
                            </div>
                          ))}
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
            <TopBar
              title="Construction Managers"
              detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              buttonText="Add CM"
              onButtonClick={() => setOpen(true)}
            />

            {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}

            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <AssignProjectManagerModal
                  onCreateClick={(bool) => {
                    setShowModal(bool);
                    setOpen(false);
                  }}
                />
              </Box>
            </Modal>

            <SimpleTable
              data={constructionManagersData}
              columns={columns}
              cellComponents={{ action: CustomActionComponent }}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Section not found or failed to load.</p>
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
