import React, { useState, useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import Loader from "../../../../components/ui/Loader";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaBoxesStacked } from "react-icons/fa6";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import SimpleTable from "../../../../components/SimpleTable";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const VendorDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/vendors/${id}`);
      if (response.ok) {
        setVendorData(response.data.vendor);
      } else {
        toast.error("Failed to fetch vendor details.");
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      toast.error("Something went wrong while fetching details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/purchase-orders");
      if (response.ok) {
        // Filter purchase orders for this specific vendor
        const vendorPOs = response.data.data.filter(po => po.vendorId === id);
        setPurchaseOrders(vendorPOs || []);
      } else {
        toast.error("Failed to fetch purchase orders.");
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      toast.error("Something went wrong while fetching purchase orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
      fetchPurchaseOrders();
    }
  }, [id]);

  // Transform purchase order data for table display
  const transformedPurchaseOrders = purchaseOrders.map(po => ({
    id: po.id,
    referenceNumber: po.referenceNumber,
    projectName: po.demand?.section?.project?.name || "N/A",
    projectCode: po.demand?.section?.project?.code || "N/A",
    sectionName: po.demand?.section?.name || "N/A",
    sectionCode: po.demand?.section?.code || "N/A",
    materialName: po.material?.name || "N/A",
    materialUnit: po.material?.unit || "N/A",
    quantity: po.quantity,
    unitPrice: po.unitPrice,
    totalAmount: po.totalAmount,
    status: po.status,
    createdAt: new Date(po.createdAt).toLocaleDateString(),
    amountAddedAt: po.amountAddedAt ? new Date(po.amountAddedAt).toLocaleDateString() : "N/A"
  }));

  const columns = [
    { headerName: "PO Reference", field: "referenceNumber" },
    { headerName: "Project", field: "projectName" },
    { headerName: "Project Code", field: "projectCode" },
    { headerName: "Section", field: "sectionName" },
    { headerName: "Section Code", field: "sectionCode" },
    { headerName: "Material", field: "materialName" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit Price", field: "unitPrice" },
    { headerName: "Total Amount", field: "totalAmount" },
    { headerName: "Status", field: "status" },
    { headerName: "Created Date", field: "createdAt" },
  ];

  if (loading) {
    return (
      <div className="px-4 py-2">
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <TopBar title="Vendor" />
      <div className="h-[1px] w-full bg-[#CDCDCD] mt-2" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {/* Left Card */}
        <div className="border-[0.5px] border-[#CDCDCD] rounded-xl p-4 bg-white">
          <h3 className="text-black font-semibold mb-4">Company Name</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Vendor Name</p>
              <p>{vendorData?.name || "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Email</p>
              <p>{vendorData?.email || "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Phone Number</p>
              <p>{vendorData?.phone || "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Address</p>
              <p>{vendorData?.address || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="md:col-span-2 flex flex-col bg-white p-4 rounded-xl border-[0.5px] border-[#CDCDCD]">
          <div className="flex justify-between items-start flex-wrap">
            <h3 className="text-xl font-semibold text-[#BF1017]">Overview</h3>
            <div className="flex gap-x-2 mt-2 md:mt-0">
              <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
              <MdEdit className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <AnalyticsCard
              label="Total Purchase Orders"
              icon={FaBoxesStacked}
              count={purchaseOrders.length || 0}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-[#BF1017] mb-4">
          Purchase Orders
        </h3>
        <div className="overflow-x-auto">
          {purchaseOrders.length > 0 ? (
            <SimpleTable data={transformedPurchaseOrders} columns={columns} cellComponents={{}} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No purchase orders found for this vendor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
