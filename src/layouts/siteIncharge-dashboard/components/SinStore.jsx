import React, { useState, useEffect } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
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
import Loader from "../../../components/ui/Loader";

const SinStores = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  const handleLinkClick = () => {
    setShowModal(true);
  };

  const fetchStore = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/stores");
      if (response.status === 200) {
        const data = response.data.stores.map((store, index) => ({
          storeId: store.id,
          storeName: store.name,
          project: store.section?.name || "-",
          storeHead: store.type === "HEAD_STORE" ? (store.storeInchargeAssignments[0]?.user?.name || "-") : "-",
          storeIncharge: store.type === "CM_STORE" ? (store.storeInchargeAssignments[0]?.user?.name || "-") : "-",
          manager: store.cmUser?.name || "-",
          accountant: store.accountant?.name || "-",
          status: store.isActive ? "Active" : "Inactive",
          action: store.id,
        }));
        setStore(data);
      } else {
        toast.error("Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Error fetching stores");
    } finally {
      setLoading(false);
    }
  };


  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
              onClick: () => navigate(`/siteincharge-dashboard/store/${id}`),
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
    { headerName: "Action", field: "action" },
  ];
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
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
        // onButtonClick={() => navigate("/siteincharge-dashboard/store/addStore")}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
        <SimpleTable
          columns={columns}
          data={store}
          cellComponents={{ action: CustomActionComponent }}
          />
        )}
      </div>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SinStores;
