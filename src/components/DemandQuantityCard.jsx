import React, { useEffect, useState } from "react";
import Button from "./Button";
import CustomTextField from "../mui/CustomTextField";
import apiClient from "../api/apiClient";
import { useSearchParams } from "react-router-dom";

export default function DemandQuantityCard({
  storeName,
  totalQty,
  material,
  showButton,
  cmStoreId,
  headStoreId,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [demandData, setDemandData] = useState({});

  const fulfillDemand = async () => {
    if (Number(quantity) > totalQty) {
      alert(`Assigned quantity exceeds available stock in ${storeName}`);
      return;
    }

    if (!quantity) {
      alert("Quantity is required.");
      return;
    }

    if (!headStoreId || !cmStoreId) {
      alert("Store IDs are missing in the URL.");
      return;
    }

    const url = `/demands/${id}/fulfill?fromStoreId=${headStoreId}&toStoreId=${cmStoreId}`;

    console.log("Submitting to API URL:", url);

    setLoading(true);
    try {
      const response = await apiClient.post(`/demands/${id}/fulfill`, {
        fromStoreId: headStoreId,
        toStoreId: cmStoreId,
        quantity,
        note,
      });

      if (response?.data?.demand) {
        setDemandData(response.data.demand);
        alert(
          `${quantity} units of ${material} assigned from ${storeName} store`
        );
        setIsOpen(false);
        setQuantity("");
        setNote("");
      } else {
        console.error("Failed to fulfill", response?.data?.message);
      }
    } catch (error) {
      console.error("API error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full mt-6">
      <h2 className="text-xl font-bold text-gray-800">{storeName}</h2>
      <p className="text-gray-600 mt-2">Material: {material}</p>
      <p className="text-gray-600">Available Quantity: {totalQty}</p>

      {showButton && Number(totalQty) > 0 && (
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
            <CustomTextField
              label="Quantity to Assign"
              placeholder="Enter quantity"
              value={quantity}
              type="number"
              onChange={(e) => setQuantity(e.target.value)}
            />
            <CustomTextField
              label="Note"
              placeholder="Enter Note"
              value={note}
              type="text"
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000]"
              >
                Cancel
              </button>

              <Button
                onClick={fulfillDemand}
                buttonText={loading ? "Approving..." : "Approve"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
