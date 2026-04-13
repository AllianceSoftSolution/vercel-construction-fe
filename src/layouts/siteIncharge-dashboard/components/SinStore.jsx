import React from "react";
import TopBar from "../../../components/ui/TopBar";
import StoreInventoryTabView from "../../../components/StoreInventoryTabView";

const SiStore = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      <TopBar title="Store Inventory" />
      <StoreInventoryTabView role="SITE_INCHARGE" dashboardPrefix="siteincharge-dashboard" />
    </div>
  );
};

export default SiStore;
