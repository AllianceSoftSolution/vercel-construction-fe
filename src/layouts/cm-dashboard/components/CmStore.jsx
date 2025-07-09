import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../comments/components/DropdownButton";
import AddMemberModal from "./users/modals/AddMemberModal";
import { IoPersonCircle } from "react-icons/io5";
import { RiAccountBox2Fill } from "react-icons/ri";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const CmStores = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const handleLinkClick = () => {
    setShowModal(true);
  };

  const fetchStore = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/stores");
      if (response.status === 200) {
        const data = response.data.stores.map((store, index) => ({
          storeId: index + 1,
          action: store.id,
          ...store,
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

  useEffect(() => {
    fetchStore();
  }, []);

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
            onClick: () =>
              navigate(`/construction-manager-dashboard/store/${id}`),
            icon: <FaEye />,
          },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const columns = [
    { headerName: "Store Id", field: "storeId" },
    { headerName: "Store Name", field: "name" },
    { headerName: "Type", field: "type" },
    { headerName: "Section Id", field: "sectionId" },
    { headerName: "Action", field: "id" },
  ];

  return (
    <div className="h-full">
      <TopBar
        title="Stores"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showFilter={true}
        filterOptions={["ON-GOING", "Pending", "Not Started"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={store}
          cellComponents={{ id: CustomActionComponent }}
        />
      </div>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default CmStores;
