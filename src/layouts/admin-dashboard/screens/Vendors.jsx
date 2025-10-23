import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import DropdownButton from "@/comments/components/DropdownButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import DeleteModal from "../../../mui/DeleteModal";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";

const Vendors = () => {
  const navigate = useNavigate();
  const [vendors, setvendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVendor = async () => { 
    try {
      setLoading(true);
      const response = await apiClient.get("/vendors");
      if (response.ok) {
        const data = response.data.vendors.map((vendor, index) => ({
          vendorId: index + 1,
          action: vendor.id,
          ...vendor,
        }));
        setvendors(data);
      } else {
        toast.error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Error fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  const handleDelete = async () => {
    if (!selectedVendorId) {
      return;
    }
    
    try {
      setDeleting(true);
      const response = await apiClient.delete(`/vendors/${selectedVendorId}`);
      if (response.ok) {
        console.log("Vendor deleted successfully");
        toast.success("Vendor deleted successfully");
        setShowDeleteModal(false);
        setSelectedVendorId(null);
        fetchVendor();
      } else {
        throw new Error(response.originalError.message);
      }
    } catch (error) {
      console.error("Error deleting Vendor item!", error.message);
      toast.error("Error deleting Vendor item!");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { headerName: "Vendor Id", field: "vendorId" },
    { headerName: "Vendor Name", field: "name" },
    { headerName: "Contact Person", field: "contactPerson" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Email", field: "email" },
    { headerName: "Address", field: "address" },
    { headerName: "Action", field: "id" },
  ];
  const CustomActionComponent = ({ value : id}) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate(`/admin-dashboard/vendors/${id}`),
            icon: <FaEye />,
          },
          {
            label: "Edit",
            onClick: () => navigate(`/admin-dashboard/vendors/addVendor`, { state: { vendor: vendors.find(v => v.id === id) } }),
            icon: <FaUserEdit />,
          },
          // {
          //   label: "Delete",
          //   onClick: () => {
          //     setSelectedVendorId(id);
          //     setShowDeleteModal(true);
          //   },
          //   icon: <FaTrash />,
          // },
        ]}
        // onClick={handleActionClick}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };
  return (
    <div className="h-full">
      <TopBar
        title="Vendors"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
       
        buttonText="Add Vendors"
        onButtonClick={() => navigate("/admin-dashboard/vendors/addVendor")}
      />
      {/* <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div> */}
      {/* table */}
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={vendors}
            cellComponents={{ id: CustomActionComponent }}
          />
        )}
      </div>
      {showDeleteModal && (
         <DeleteModal
           onClose={() => setShowDeleteModal(false)}
           onConfirm={handleDelete}
           loading={deleting}
         />
       )}
    </div>
  );
};

export default Vendors;
