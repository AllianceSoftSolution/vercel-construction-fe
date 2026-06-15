import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import ProjectInfoCard from "../../../../components/ui/ProjectInfoCard";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaUserEdit, FaStore } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { useNavigate, Link } from "react-router-dom";
import AddMemberModal from "../users/modals/AddMemberModal";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import MemebersOverviewCard from "../../../../../src/mui/MembersOverviewCard";
import manager from "../../../../../src/assets/construction/manager.png";
import Search from "../../../../../src/assets/construction/Search.png";
import AssignProjectManagerModal from "../../../../components/AssignProjectManagerModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};
const SectionDetailPage = () => {
  const navigate = useNavigate();
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Store",
            onClick: () => navigate("123"),
            icon: <FaUserEdit />,
          },
          {
            label: "Go to Store",
            onClick: () => {
              navigate(`/accountant-dashboard/store/${data}`);
            },
            icon: <FaStore />,
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
        // onClick={handleActionClick}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const CustomStoreLinkComponent = ({ value }) => (
    <Link
      to={`/accountant-dashboard/store/${value?.id}`}
      className="underline text-blue-500"
    >
      {value?.name}
    </Link>
  );

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
    {
      id: 2,
      cmId: "1",
      constructionManager: "Hassan",
      email: "h@gmail.com",
      phone: +123455666,
      address: "A1",
      status: "Pending",
      date: "2025-06-15",
      action: "id-here",
    },
    {
      id: 3,
      cmId: "1",
      constructionManager: "Hassan",
      email: "h@gmail.com",
      phone: +123455666,
      address: "A1",
      status: "Pending",
      date: "2025-06-15",
      action: "id-here",
    },
  ];
  const columns = [
    { headerName: "CM ID", field: "cmId" },
    { headerName: "Construction Manager", field: "constructionManager" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone" },
    { headerName: "Address", field: "address" },
    { headerName: "Status", field: "status" },
    { headerName: "Date", field: "date" },
    { headerName: "CM Store", field: "cmStore" },
    { headerName: "Action", field: "action" },
  ];
  const [showModal, setShowModal] = useState(false);
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const [hasStoreHeadInfo, setHasStoreHeadInfo] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLinkClick = () => {
    setShowModal(true);
  };
  return (
    <div className="mt-4">
      <TopBar
        title="Section Details"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showIcon={true}
      />
      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex justify-between gap-x-4 flex-wrap">
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">
              Project Name:
            </p>
            <p className="text-[#979797]">project name</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">
              Project Code:
            </p>
            <p className="text-[#979797]">project Code</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Section:</p>
            <p className="text-[#979797]">section</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Amount:</p>
            <p className="text-[#979797]">amount</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Date:</p>
            <p className="text-[#979797]">date</p>
          </div>
        </div>

        <div className="flex justify-start gap-x-14 flex-wrap">
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">
              Project Location:
            </p>
            <p className="text-[#979797]">project Location</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">
              Project Status:
            </p>
            <p className="text-[#979797]">project Status</p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="mt-10 text-[#12141D] font-semibold text-xl">
          Members Overview
        </h4>
        <div className="flex gap-5">
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
              // onLinkClick={handleLinkClick}
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
              // onLinkClick={handleLinkClick}
              imageSrc={Search}
              imageAlt="Search Illustration"
              onManagerClick={(id) => setHasStoreHeadInfo(id)}
            />
          )}
        </div>
      </div>
      <div className="mt-10">
        <TopBar
          title="Construction Managers "
          detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          buttonText="Add CM"
          onButtonClick={handleOpen}
        />
        {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
        <div>
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
        </div>
        <SimpleTable
              tableTitle="construction-managers"
          data={data}
          columns={columns}
          cellComponents={{ 
            action: CustomActionComponent,
            cmStore: CustomStoreLinkComponent
          }}
        />
      </div>
    </div>
  );
};

export default SectionDetailPage;
