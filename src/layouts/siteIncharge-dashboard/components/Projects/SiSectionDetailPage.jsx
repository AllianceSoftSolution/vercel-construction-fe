import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import ProjectInfoCard from "../../../../components/ui/ProjectInfoCard";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { useNavigate } from "react-router-dom";
import AddMemberModal from "../users/modals/AddMemberModal";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import MemebersOverviewCard from "../../../../mui/MembersOverviewCard";
import manager from "../../../../../src/assets/construction/manager.png";
import Search from "../../../../../src/assets/construction/Search.png";
import AssignProjectManagerModal from "../../../../components/AssignProjectManagerModal";

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

  const CustomActionComponent = ({ data }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail",
          onClick: () =>
            navigate("/siteincharge-dashboard/user-management/123"),
          icon: <FaUserEdit />,
        },
        // {
        //   label: "Edit",
        //   onClick: () => alert("Edit"),
        //   icon: <FaUserEdit />,
        // },
        // {
        //   label: "Delete",
        //   onClick: () => alert("Delete"),
        //   icon: <FaTrash />,
        // },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  const data = [
    {
      id: 1,
      cmId: "1",
      constructionManager: "Hassan",
      email: "h@gmail.com",
      phone: "+123455666",
      address: "A1",
      status: "Pending",
      date: "2025-06-15",
      action: "id-here",
    },
    // more records...
  ];

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

  return (
    <div className="px-4 md:px-8 py-4">
      <TopBar
        title="Section Details"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />

      {/* Section Info */}
      <div className="bg-[#F7F7F7] rounded-md mt-4 p-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-wrap sm:flex-row gap-4">
          <InfoPair label="Project Name" value="project name" />
          <InfoPair label="Project Code" value="project code" />
          <InfoPair label="Section" value="section" />
          <InfoPair label="Amount" value="amount" />
          <InfoPair label="Date" value="date" />
          <InfoPair label="Project Location" value="location" />
          <InfoPair label="Project Status" value="status" />
        </div>
      </div>

      {/* Member Cards */}
      <h4 className="mt-10 text-[#12141D] font-semibold text-xl">
        Members Overview
      </h4>
      <div className="flex flex-col lg:flex-row gap-5 mt-4">
        <div className="w-full lg:w-1/2 flex">
          <div className="w-full h-full flex flex-col">
            {hasMemberInfo ? (
              <MemberInfoCard
                title="General information - Project Manager"
                image={manager}
                name="Manager name here"
                phone="+92 300 000 090"
                role="Project Manager"
                email="example@gmail.com"
                joiningDate="January 8, 2001"
                id="9090"
                address="address here"
                country="United States"
                linkedStores={["Store A", "Store B", "Store C"]}
              />
            ) : (
              <MemebersOverviewCard
                title="General Information"
                subTitle="Project Manager"
                linkText="Assign Project Manager"
                imageSrc={Search}
                imageAlt="Search Illustration"
                onManagerClick={() => setHasMemberInfo(true)}
              />
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex">
          <div className="w-full h-full flex flex-col">
            {hasStoreHeadInfo ? (
              <MemberInfoCard
                title="General information - Store Head"
                image={manager}
                name="Manager name here"
                phone="+92 300 000 090"
                role="Store Head"
                email="example@gmail.com"
                joiningDate="January 8, 2001"
                id="9090"
                address="address here"
                country="United States"
                linkedStores={["Store A", "Store B", "Store C"]}
              />
            ) : (
              <MemebersOverviewCard
                title="General Information"
                subTitle="Store Head"
                linkText="Assign Store Head"
                imageSrc={Search}
                imageAlt="Search Illustration"
                onManagerClick={() => setHasStoreHeadInfo(true)}
              />
            )}
          </div>
        </div>
      </div>

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
          data={data}
          columns={columns}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>
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
