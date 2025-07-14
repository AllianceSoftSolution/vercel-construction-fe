import { Checkbox, Input, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import Loader from "../Loader";

export default function AssignSectionModal({ 
  handleCancel, 
  handleSubmit, 
  userData, 
  sections = [], 
  loading = false, 
  submitting = false 
}) {
  console.log("User data in checkbox :- ", userData);
  
  const [selectedSections, setSelectedSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (filteredSections.every((s) => selectedSections.includes(s.id))) {
      setSelectedSections((prev) =>
        prev.filter((id) => !filteredSections.map((s) => s.id).includes(id))
      );
    } else {
      setSelectedSections((prev) => [
        ...prev,
        ...filteredSections.map((s) => s.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const isAllSelected =
    filteredSections.length > 0 &&
    filteredSections.every((s) => selectedSections.includes(s.id));

  if (loading) {
    return (
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-[#043b6a]">
            Assign Sections
          </h2>
          <p className="text-sm text-gray-500">
            Select the sections to assign from the list below.
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader text="Loading sections..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-[#043b6a]">
          Assign Sections
        </h2>
        <p className="text-sm text-gray-500">
          Select the sections to assign from the list below.
        </p>
      </div>

      <div className="relative">
        <Input
          placeholder="Search sections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full !rounded-xl !bg-[#f9f9fb] !px-4 !py-3 !h-auto !text-sm placeholder:text-gray-500 pr-12"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {filteredSections.length > 0 && (
        <div
          onClick={handleSelectAll}
          className="flex justify-between items-center cursor-pointer rounded-xl border border-gray-200 hover:border-[#fc8908] bg-[#f8f9fc] px-4 py-3 transition"
        >
          <span className="text-sm font-medium text-[#043b6a]">
            {isAllSelected ? "Unselect All" : "Select All"}
          </span>
          <Checkbox checked={isAllSelected} />
        </div>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
        {filteredSections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sections found.
          </div>
        ) : (
          filteredSections.map((section) => (
            <div
              key={section.id}
              className="flex justify-between items-center rounded-xl border border-gray-100 bg-white px-4 py-3 hover:shadow-sm transition cursor-pointer hover:border-[#fc8908]"
            >
              <span className="text-sm text-[#043b6a] font-medium">
                {section.name}
              </span>
              <Checkbox
                checked={selectedSections.includes(section.id)}
                onChange={() => handleCheckboxChange(section.id)}
              />
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-primary px-8 py-2 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? "Assigning..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
