import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/materials");
      if (response.ok) {
        const data = response.data.materials.map((material, index) => ({
          ...material,
        }));
        setMaterials(data);
      } else {
        toast.error("Failed to fetch materials");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Error fetching materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  const columns = [
    { headerName: "ID", field: "id" },
    { headerName: "Product Name", field: "name" },
    { headerName: "Description", field: "description" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Category", field: "category" },
  ];

  return (
    <div className="h-full">
      <TopBar
        title="Materials"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
        buttonText="Add Product"
        onButtonClick={() => navigate("/admin-dashboard/materials/addProduct")}
      />
      {/* <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div> */}

      {/* table */}
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={materials}
            cellComponents={{}}
          />
        )}
      </div>
    </div>
  );
};

export default Materials;
