import React, { useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SInchargeSectionTab = ({ data, onSectionDeleted, loading }) => {
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const navigate = useNavigate();

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get section manager
  const getSectionManager = (section) => {
    if (!section.constructionManagerAssignments || section.constructionManagerAssignments.length === 0) {
      return "Not assigned";
    }
    return section.constructionManagerAssignments[0].user?.name || "Unknown";
  };

  // Get linked stores count
  const getLinkedStoresCount = (section) => {
    if (!section.stores) return "0";
    return section.stores.length.toString();
  };

  // Get store incharge assignments
  const getStoreInchargeAssignments = (section) => {
    if (!section.stores) return [];
    
    const assignments = [];
    section.stores.forEach(store => {
      if (store.storeInchargeAssignments && store.storeInchargeAssignments.length > 0) {
        store.storeInchargeAssignments.forEach(assignment => {
          assignments.push({
            user: assignment.user,
            store: store
          });
        });
      }
    });
    
    return assignments;
  };

  // Transform sections data
  const transformSectionsData = () => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((section, index) => ({
      id: section.id,
      sectionNo: (index + 1).toString().padStart(2, '0'),
      sectionName: section.name || "Unknown Section",
      totalDemands: "0", // This would come from API if available
      totalAmount: "0", // This would come from API if available
      paidAmount: "0", // This would come from API if available
      remainingAmount: "0", // This would come from API if available
      manager: getSectionManager(section),
      linkedStores: getLinkedStoresCount(section),
      createdAt: formatDate(section.createdAt),
      description: section.description || "No description available",
      isActive: section.isActive,
      stores: section.stores || [],
      storeIncharges: getStoreInchargeAssignments(section),
    }));
  };

  const actions = [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: (sectionId) => navigate(`/siteincharge-dashboard/project-management/sections/${sectionId}`),
    },
  ];

  const sectionsData = transformSectionsData();

  return (
    <div className="px-4 py-4 md:px-6 w-full">
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading sections...</p>
        </div>
      ) : sectionsData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionsData.map((section) => (
            <SectionCard
              key={section.id}
              sectionNo={section.sectionNo}
              sectionName={section.sectionName}
              totalDemands={section.totalDemands}
              totalAmount={section.totalAmount}
              paidAmount={section.paidAmount}
              remainingAmount={section.remainingAmount}
              manager={section.manager}
              linkedStores={section.linkedStores}
              dropdownActions={actions.map(action => ({
                ...action,
                onClick: () => action.onClick(section.id)
              }))}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No sections found for this project.</p>
        </div>
      )}


    </div>
  );
};

export default SInchargeSectionTab;
