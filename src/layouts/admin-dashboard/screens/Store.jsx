import React, { useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import StoreCreationTab from "./store/StoreCreationTab";
import StoreInventoryTabView from "../../../components/StoreInventoryTabView";

const TAB_LIST = [
  { key: "creation", label: "Store Creation" },
  { key: "inventory", label: "Store Inventory" },
];

const Stores = () => {
  const [activeTab, setActiveTab] = useState("creation");

  return (
    <div className="h-full flex flex-col gap-4">
      <TopBar title="Stores" />

      {/* Tab pills */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {TAB_LIST.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all
              ${activeTab === tab.key
                ? "border-[#F97316] text-[#F97316] bg-orange-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "creation" && <StoreCreationTab />}
        {activeTab === "inventory" && (
          <StoreInventoryTabView role="ADMIN" dashboardPrefix="admin-dashboard" />
        )}
      </div>
    </div>
  );
};

export default Stores;
