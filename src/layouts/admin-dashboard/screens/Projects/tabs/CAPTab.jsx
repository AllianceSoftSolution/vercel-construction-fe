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
      ) : (
        <SimpleTable
          data={transformedData}
          columns={columns}
          cellComponents={{}}
        />
      )}
    </div>
  );
};

export default CAPTab;
