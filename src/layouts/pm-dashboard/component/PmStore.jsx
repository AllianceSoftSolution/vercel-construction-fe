import React from "react";
import TopBar from "../../../components/ui/TopBar";
import StoreInventoryTabView from "../../../components/StoreInventoryTabView";

const Stores = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      <TopBar title="Store Inventory" />
      <StoreInventoryTabView role="PROJECT_MANAGER" dashboardPrefix="project-manager-dashboard" />
    </div>
  );
};

export default Stores;