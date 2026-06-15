import React, { useState, useEffect } from "react";
import SimpleTable from "../../../../../components/SimpleTable";
import Loader from "../../../../../components/ui/Loader";
import apiClient from "../../../../../api/apiClient";
import toast from "react-hot-toast";

const CAPTab = ({ data, projectId }) => {
  const [capData, setCapData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      field: "materialName",
      headerName: "Material Name",
      width: 200,
    },
    {
      field: "totalCapQuantity",
      headerName: "CAP Quantity",
      width: 120,
    },
    {
      field: "capUnit",
      headerName: "Unit",
      width: 120,
    },
    {
      field: "totalDemandQuantity",
      headerName: "Demand Quantity",
      width: 150,
    },
    {
      field: "totalPurchaseOrderQuantity",
      headerName: "PO Quantity",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
  ];

  // Custom cell renderer for CAP quantity to show color coding
  const CapQuantityComponent = ({ value, row }) => {
    if (!row) {
      return <span>{value}</span>;
    }
    
    const capQuantity = row.totalCapQuantity || 0;
    const demandQuantity = row.totalDemandQuantity || 0;
    const poQuantity = row.totalPurchaseOrderQuantity || 0;
    
    // Check if demand quantity exceeds cap quantity
    const isDemandExceeded = demandQuantity > capQuantity;
    // Check if PO quantity exceeds cap quantity
    const isPOExceeded = poQuantity > capQuantity;
    
    let textColor = 'text-green-600 font-semibold'; // Default green
    
    if (isDemandExceeded || isPOExceeded) {
      textColor = 'text-red-600 font-semibold'; // Red if either exceeds
    }
    
    return (
      <span className={textColor}>
        {value}
      </span>
    );
  };

  // Custom cell renderer for status with chips
  const StatusComponent = ({ value, row }) => {
    // If row is undefined, we'll work with just the value
    const getStatusInfo = (status) => {
      // Map status strings to display info
      switch (status) {
        case "WITHIN_LIMIT":
          return { text: "Within Limit", color: "bg-green-100 text-green-800" };
        case "DEMAND_EXCEEDED":
          return { text: "Demand Exceeded", color: "bg-orange-100 text-orange-800" };
        case "PO_EXCEEDED":
          return { text: "PO Exceeded", color: "bg-yellow-100 text-yellow-800" };
        case "BOTH_EXCEEDED":
          return { text: "Both Exceeded", color: "bg-red-100 text-red-800" };
        case "PENDING":
          return { text: "Pending", color: "bg-gray-100 text-gray-800" };
        case "INACTIVE":
          return { text: "Inactive", color: "bg-gray-100 text-gray-600" };
        default:
          return { text: status || "Unknown", color: "bg-gray-100 text-gray-800" };
      }
    };

    const statusInfo = getStatusInfo(value);

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  // Fetch CAP data when component mounts or data changes
  const fetchCAPData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/material-caps/project/${projectId}`);
      
      if (response.ok) {
        const caps = response.data.caps || [];
        setCapData(caps);
      } else {
        toast.error("Failed to fetch CAP data");
      }
    } catch (error) {
      console.error("Error fetching CAP data:", error);
      toast.error("Error fetching CAP data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If data has materialCapAnalytics, use that, otherwise fetch from API
    if (data?.materialCapAnalytics) {
      console.log("Material CAP Analytics from props:", data.materialCapAnalytics);
      setCapData(data.materialCapAnalytics);
    } else if (projectId) {
      // Fetch CAP data from API if not provided in props
      fetchCAPData();
    }
  }, [data, projectId]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Transform data to include formatted dates
  const transformedData = capData.map(item => ({
    ...item,
    createdAt: formatDate(item.createdAt)
  }));

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-full min-h-[200px]">
          <Loader />
        </div>
      ) : capData.length === 0 ? (
        <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
          <p className="text-gray-500">No CAP data available</p>
        </div>
      ) : (
        <SimpleTable
              tableTitle="cap"
          data={transformedData}
          columns={columns}
          cellComponents={{
            totalCapQuantity: CapQuantityComponent,
            status: StatusComponent
          }}
        />
      )}
    </div>
  );
};

export default CAPTab;
