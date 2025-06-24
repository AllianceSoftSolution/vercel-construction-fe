import React, { useState } from "react";
import Button from "./Button";

export default function DemandQuantityCard({ storeName, totalQty, material, showButton }) {
  const [isOpen, setIsOpen] = useState(false);
  const [assignedQty, setAssignedQty] = useState("");

  const handleApprove = () => {
    if (Number(assignedQty) > totalQty) {
      alert(`Assigned quantity exceeds available stock in ${storeName}`);
      return;
    }

    alert(
      `${assignedQty} units of ${material} assigned from ${storeName} store`
    );
    setIsOpen(false);
    setAssignedQty("");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full mt-6">
      <h2 className="text-xl font-bold text-gray-800">{storeName}</h2>
      <p className="text-gray-600 mt-2">Material: {material}</p>
      <p className="text-gray-600">Available Quantity: {totalQty}</p>

      {showButton && (
        <button
          onClick={() => setIsOpen(true)}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Assign & Approve
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Assign Quantity from {storeName}
            </h3>

            <label className="block text-sm text-gray-700 mb-1">
              Quantity to Assign:
            </label>
            <input
              type="number"
              value={assignedQty}
              onChange={(e) => setAssignedQty(e.target.value)}
              placeholder="Enter quantity"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000]s"
                buttonText={"Cancel"}
              >
                {" "}
                Cancel
              </button>

              <Button onClick={handleApprove} buttonText={"Approve"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
