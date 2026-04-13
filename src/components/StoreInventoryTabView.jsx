import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import Loader from "./ui/Loader";
import SimpleTable from "./SimpleTable";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TYPE_COLORS = {
  HEAD_STORE: { bg: "bg-green-100 text-green-700 border-green-300", badge: "bg-green-600" },
  CM_STORE: { bg: "bg-purple-100 text-purple-700 border-purple-300", badge: "bg-purple-600" },
  SECTION_STORE: { bg: "bg-blue-100 text-blue-700 border-blue-300", badge: "bg-blue-600" },
};

const TYPE_LABELS = {
  HEAD_STORE: "Head Store",
  CM_STORE: "CM Store",
  SECTION_STORE: "Section Store",
};

/**
 * StoreInventoryTabView
 * @param {string}   role            - user role (controls actions visibility)
 * @param {string}   dashboardPrefix - route prefix e.g. "admin-dashboard" or "siteincharge-dashboard"
 */
const StoreInventoryTabView = ({ role, dashboardPrefix = "admin-dashboard" }) => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get("/projects");
        if (res.ok) {
          const list = res.data.projects || res.data.data || [];
          setProjects(list);
          if (list.length > 0) {
            setSelectedProjectId(list[0].id);
          }
        }
      } catch {
        toast.error("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  // Fetch stores when selected project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        setSelectedStore(null);
        setInventory([]);
        const res = await apiClient.get(`/stores?projectId=${selectedProjectId}`);
        if (res.ok) {
          setStores(res.data.stores || []);
        } else {
          toast.error("Failed to load stores");
        }
      } catch {
        toast.error("Error loading stores");
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  }, [selectedProjectId]);

  // Fetch inventory when selected store changes
  useEffect(() => {
    if (!selectedStore) return;
    const fetchInventory = async () => {
      try {
        setLoadingInventory(true);
        const res = await apiClient.get(`/stores/${selectedStore.id}/inventory`);
        if (res.ok) {
          setInventory(res.data.inventory || []);
        } else {
          toast.error("Failed to load inventory");
        }
      } catch {
        toast.error("Error loading inventory");
      } finally {
        setLoadingInventory(false);
      }
    };
    fetchInventory();
  }, [selectedStore]);

  const getSummary = (store) => {
    // Count inventory items via total items in the store (we don't have it here without fetching each)
    return store._count?.inventory ?? null;
  };

  const inventoryColumns = [
    { headerName: "Material", field: "material.name" },
    { headerName: "Available Qty", field: "available" },
    { headerName: "Unit", field: "material.unit" },
    { headerName: "Last Updated", field: "updatedAt" },
  ];

  const LastUpdatedCell = ({ value }) => (
    <span className="text-sm text-gray-600">
      {value ? new Date(value).toLocaleDateString() : "—"}
    </span>
  );

  const projectName = projects.find((p) => p.id === selectedProjectId)?.name || "";

  return (
    <div className="flex flex-col gap-5">
      {/* Project selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Project:</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Store tabs */}
      {loadingStores ? (
        <Loader />
      ) : stores.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No stores found for this project.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {stores.map((store) => {
            const colorCls = TYPE_COLORS[store.type] || TYPE_COLORS.SECTION_STORE;
            const isActive = selectedStore?.id === store.id;
            return (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`flex flex-col items-start px-4 py-3 rounded-xl border-2 transition-all duration-150 min-w-[160px]
                  ${isActive
                    ? "bg-[#F97316] border-[#F97316] text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#F97316] hover:shadow-sm"
                  }`}
              >
                <span className="font-semibold text-sm truncate max-w-[180px]">{store.name}</span>
                <span
                  className={`text-xs mt-1 px-2 py-0.5 rounded-full font-medium
                    ${isActive ? "bg-white/20 text-white" : colorCls.bg}`}
                >
                  {TYPE_LABELS[store.type] || store.type}
                </span>
                {store.section && (
                  <span className={`text-xs mt-1 ${isActive ? "text-white/80" : "text-gray-400"}`}>
                    {store.section.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Inventory table */}
      {selectedStore && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-700">
              Inventory — <span className="text-[#F97316]">{selectedStore.name}</span>
            </h3>
            <button
              onClick={() => navigate(`/${dashboardPrefix}/store/${selectedStore.id}`)}
              className="flex items-center gap-1.5 text-sm text-[#F97316] hover:underline font-medium"
            >
              <FaEye size={14} /> View Store Details
            </button>
          </div>

          {loadingInventory ? (
            <Loader />
          ) : inventory.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No inventory items found for this store.
            </div>
          ) : (
            <SimpleTable
              columns={inventoryColumns}
              data={inventory.map((item) => ({
                ...item,
                updatedAt: item.updatedAt,
              }))}
              cellComponents={{ updatedAt: LastUpdatedCell }}
            />
          )}
        </div>
      )}

      {!selectedStore && !loadingStores && stores.length > 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Select a store tab above to view its inventory.
        </div>
      )}
    </div>
  );
};

export default StoreInventoryTabView;
