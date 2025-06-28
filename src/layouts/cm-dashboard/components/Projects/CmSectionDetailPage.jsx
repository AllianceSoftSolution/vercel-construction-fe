import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
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
  width: "90%",
  maxWidth: "600px",
  boxShadow: 24,
};

const CmSectionDetailPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const [hasStoreHeadInfo, setHasStoreHeadInfo] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Store",
            onClick: () =>
              navigate("/construction-manager-dashboard/user-Management/123"),
            icon: <FaUserEdit />,
          },
          {
            label: "Edit",
            onClick: () => alert("Edit"),
            icon: <FaUserEdit />,
          },
          {
            label: "Delete ",
            onClick: () => alert("Delete"),
            icon: <FaTrash />,
          },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const data = [
    {
      id: 1,
      cmId: "1",
      constructionManager: "Hassan",
      email: "h@gmail.com",
      phone: +123455666,
      address: "A1",
      status: "Pending",
      date: "2025-06-15",
      action: "id-here",
    },
    // ... more rows
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

  return (
    <div className="mt-4 px-4 w-full">
      <TopBar
        title="Section Details"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />

      {/* Project Info */}
      <div className="bg-[#F7F7F7] rounded-md mt-4 p-4 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-4">
          {[
            ["Project Name", "project name"],
            ["Project Code", "project Code"],
            ["Section", "section"],
            ["Amount", "amount"],
            ["Date", "date"],
          ].map(([label, value], index) => (
            <div key={index} className="flex items-center gap-2 w-full sm:w-[45%]">
              <p className="text-[#444444] font-semibold text-sm sm:text-base">
                {label}:
              </p>
              <p className="text-[#979797] text-sm sm:text-base">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 items-center w-full sm:w-[45%]">
            <p className="text-[#444444] font-semibold text-sm sm:text-base">
              Project Location:
            </p>
            <p className="text-[#979797] text-sm sm:text-base">project Location</p>
          </div>
          <div className="flex gap-2 items-center w-full sm:w-[45%]">
            <p className="text-[#444444] font-semibold text-sm sm:text-base">
              Project Status:
            </p>
            <p className="text-[#979797] text-sm sm:text-base">project Status</p>
          </div>
        </div>
      </div>

      {/* Members Overview */}
      <div className="mt-10">
        <h4 className="text-[#12141D] font-semibold text-lg sm:text-xl mb-4">
          Members Overview
        </h4>
        <div className="flex flex-wrap gap-4">
          {hasMemberInfo ? (
            <MemberInfoCard
              title="General information - Store Head"
              image={manager}
              name="Manager name here"
              phone="+92 300 000 090"
              role="Store Head"
              email="example@gmail.com"
              joiningDate="January 8, 2001"
              id="9090"
              address="addresshere"
              country="United State"
              linkedStores={["Store A", "Store B", "Store C"]}
            />
          ) : (
            <MemebersOverviewCard
              title="General Information"
              subTitle="Project Manager"
              linkText="Assign Project Manager"
              imageSrc={Search}
              imageAlt="Search Illustration"
              onManagerClick={(id) => sethasMemberInfo(id)}
            />
          )}
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
              address="addresshere"
              country="United State"
              linkedStores={["Store A", "Store B", "Store C"]}
            />
          ) : (
            <MemebersOverviewCard
              title="General Information"
              subTitle="Store Head"
              linkText="Assign Store Head"
              imageSrc={Search}
              imageAlt="Search Illustration"
              onManagerClick={(id) => setHasStoreHeadInfo(id)}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-10">
        <TopBar
          title="Construction Managers"
          detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          buttonText="Add CM"
          onButtonClick={handleOpen}
        />
        {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}

        <Modal
          open={open}
          onClose={handleClose}
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

        <div className="overflow-x-auto mt-4">
          <SimpleTable
            data={data}
            columns={columns}
            cellComponents={{ action: CustomActionComponent }}
          />
        </div>
      </div>
    </div>
  );
};

export default CmSectionDetailPage;
