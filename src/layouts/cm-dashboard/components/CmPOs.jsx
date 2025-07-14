import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import Loader from "../../../components/ui/Loader";
import DropdownButton from "../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosEye } from "react-icons/io";
import { RiFileEditFill } from "react-icons/ri";
import ChangeVendor from "./users/modals/ChangeVendor";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
const CmPos = () => {
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const data = [
    {
      id: 1,
      demandId: "001",
      demandName: "Cement",
      project: "Bridge Construction",
      material: "Cement",
      section: "A1",
      qty: 120,
      unit: "ton",
      poQty: 100,
      status: "Pending",
      assingedVendors: "Owner",
    },
    {
      id: 2,
      demandId: "002",
      demandName: "Cement",
      project: "Highway Expansion",
      material: "Steel",
      section: "B2",
      qty: 250,
      unit: "ton",
      poQty: 100,
      status: "Approved",
    },
    {
      id: 3,
      demandId: "003",
      demandName: "Cement",
      project: "Metro Rail",
      material: "Concrete",
      section: "C3",
      qty: 300,
      unit: "ton",
      poQty: 100,
      status: "In Progress",
      assingedVendors: "Owner",
    },
  ];

  const columns = [
    { headerName: "Demand ID", field: "demandId" },
    { headerName: "Project Name", field: "project" },
    { headerName: "Demand ", field: "demandName" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Status", field: "status" },
    { headerName: "Assigned Vendors", field: "assingedVendors" },
    { headerName: "Action", field: "id" },
  ];

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
              onClick: () => navigate(`/construction-manager-dashboard/pOS/${id}`),
            icon: <IoIosEye />,
          },
          // {
          //   label: "Edit",
          //   icon: <FaUserEdit />,
          // },
          // {
          //   label: "Change Vendor",
          //   onClick: () => setVendorModalOpen(true),
          //   icon: <RiFileEditFill />,
          // },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };


  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/purchase-orders");
      if (response.ok) {
        const data = response.data.data.map((po, index) => ({
          id: po.id,
          demandId: po.demand?.referenceNumber || "-",
          project: po.demand?.section?.project?.name || "-",
          demandName: po.demand?.referenceNumber || "-",
          material: po.materialId,
          section: po.demand?.section?.name || "-",
          qty: po.demand?.quantity || "-",
          unit: po.demand?.unit || "-",
          poQty: po.quantity || "-",
          status: po.status || "-",
          assingedVendors: po.vendorId,
        }));
        setPurchaseOrders(data);
      } else {
        toast.error("Failed to fetch purchase orders");
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-full">
      <TopBar
        title="Purchase Orders"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showFilter={true}
        filterOptions={["Completed", "Partial", "Pending"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={purchaseOrders}
          loading={loading}
          cellComponents={{ id: CustomActionComponent }}
        />
      </div>

      {/* Modal */}
      <ChangeVendor
        open={isVendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
      />
    </div>
  );
};

export default CmPos;
