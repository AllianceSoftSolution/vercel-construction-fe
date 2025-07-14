import React, { useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import Loader from "../../../components/ui/Loader";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../comments/components/DropdownButton";
import AddMemberModal from "./users/modals/AddMemberModal";
import { IoPersonCircle } from "react-icons/io5";
import { RiAccountBox2Fill } from "react-icons/ri";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const SiStore = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  React.useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/stores");
        if (res.ok) {
          setStores(res.data.stores || []);
        } else {
          toast.error("Failed to fetch stores");
        }
      } catch (err) {
        toast.error("Error fetching stores");
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleLinkClick = () => {
    setShowModal(true);
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
            onClick: () => navigate(`/store-incharge-dashboard/store/${id}`),
            icon: <FaEye />,
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

  const columns = [
    { headerName: "Store Id", field: "storeId" },
    { headerName: "Store Name", field: "storeName" },
    { headerName: "Project", field: "project" },
    { headerName: "Store Head", field: "storeHead" },
    { headerName: "Store Incharge", field: "storeIncharge" },
    { headerName: "Manager", field: "manager" },
    { headerName: "Accountant", field: "accountant" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "id" },
  ];

  // Map API data to table data
  const tableData = stores.map((store) => ({
    id: store.id,
    storeId: store.code || store.id,
    storeName: store.name,
    project: store.section?.name?.split(" of ")[1] || "-",
    storeHead: store.storeHeadAssignments?.[0]?.user?.name || "-",
    storeIncharge: store.storeInchargeAssignments?.[0]?.user?.name || "-",
    manager: store.managerAssignments?.[0]?.user?.name || "-",
    accountant: store.accountantAssignments?.[0]?.user?.name || "-",
    status: store.status || (store.isActive ? "Active" : "Inactive"),
    action: store, // pass full store for action component
  }));

  return (
    <div className="h-full">
      <TopBar
        title="Stores"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        showFilter={true}
        filterOptions={["ON-GOING", "Pending", "Not Started"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
        // buttonText="Add New Store"
        // onButtonClick={() =>
        //   navigate("/store-incharge-dashboard/store/addStore")
        // }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={tableData}
          loading={loading}
          cellComponents={{ id: CustomActionComponent }}
        />
      </div>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SiStore;
