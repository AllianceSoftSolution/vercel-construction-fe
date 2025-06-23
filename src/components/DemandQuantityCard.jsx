import React, { useState } from "react";
import Button from "./Button";

export default function DemandQuantityCard({ storeName, totalQty, material }) {
  const [isOpen, setIsOpen] = useState(false);
  const [assignedQty, setAssignedQty] = useState("");

  const handleApprove = () => {
    if (Number(assignedQty) > totalQty) {
      alert(`Assigned quantity exceeds available stock in ${storeName}`);
      return;
    }

    alert(
      `✅ ${assignedQty} units of ${material} assigned from ${storeName} store`
    );
    setIsOpen(false);
    setAssignedQty("");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full mt-6">
      <h2 className="text-xl font-bold text-gray-800">{storeName}</h2>
      <p className="text-gray-600 mt-2">Material: {material}</p>
      <p className="text-gray-600">Available Quantity: {totalQty}</p>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
      >
        Assign & Approve
      </button>

      {/* Modal */}
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
              <Button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                buttonText={"Cancel"}
              />

              <Button
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                buttonText={"Approve"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
