import React, { useState, useEffect } from "react";
import ThreeDotButton from "../../ThreeDotButton";
import DashedLineSVG from "../../DashedLineSVG";
import CustomTextField from "../../../mui/CustomTextField";
import RoundedButton from "../../../mui/RoundedButton";

const ProposalInvoice = ({ services, onServiceChange, values }) => {
  const [serviceData, setServiceData] = useState([]);
console.log('form data: final', serviceData)
  // Initialize serviceData whenever services prop changes
  useEffect(() => {
    const initialData = services?.map(service => {
      const existingService = serviceData?.find(item => item.id === service._id);
  
      return {
        id: service?._id || service?.serviceId,
        name: service?.name,
        billingMode: service?.billingMode,
        quantity: service?.qty || existingService?.quantity || 1, // Retain the existing quantity or default to 1
        price: existingService ? existingService?.price : service?.price, // Retain existing price or default to the service price
        totalPrice: existingService && existingService?.totalPrice || service?.totalPrice || service?.price * service?.qty || service?.price, // Retain the total price or default to price
      };
    });
  
    setServiceData(initialData);
  }, [services]);

  // Update total prices whenever quantity or price changes
  const updateTotalPrices = (index) => {
    setServiceData(prevData =>
      prevData?.map((service, idx) => ({
        ...service,
        totalPrice: idx === index ? service.price * service.quantity : service.totalPrice
      }))
    );
  };

  const handleQuantityChange = (index, newQty) => {
    const updatedData = [...serviceData];
    
    // Only set if newQty is a valid number and >= 1
    if (!isNaN(newQty) && newQty > 0) {
      updatedData[index].quantity = newQty; // Update quantity only if it's valid
      console.log('this', newQty);
    } else {
      updatedData[index].quantity = 1; // Reset to 1 if the input is invalid
      
    }

    setServiceData(updatedData);
    updateTotalPrices(index);
    onServiceChange(index, 'qty', updatedData[index].quantity);
  };

  const handlePriceChange = (index, newPrice) => {
    const updatedData = [...serviceData];
    updatedData[index].price = newPrice >= 0 ? newPrice : 0; // Prevent negative prices
    setServiceData(updatedData);
    updateTotalPrices(index);
    onServiceChange(index, 'price', updatedData[index].price);
  };

  return (
    <div className="bg-white border-[1px] border-black/20 p-5 w-full rounded-lg flex flex-col gap-y-2">
      <DashedLineSVG />
      
      <div className="w-full grid grid-cols-8 gap-4 items-center mb-2">
        <div className="col-span-3">
          <p className="font-semibold">Service</p>
        </div>
        <div className="col-span-1">
          <p className="font-semibold">Billing Mode</p>
        </div>
        <div className="col-span-1">
          <p className="font-semibold">Quantity</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold">Price</p>
        </div>
        <div className="col-span-1 flex justify-end">
          <p className="font-semibold">Total Price</p>
        </div>
      </div>

      {serviceData?.length > 0 ? (
        serviceData?.map((service, index) => (
          <div key={service.id} className="w-full grid grid-cols-8 gap-4 items-center mb-2">
            <div className="col-span-3">
              <p className="font-semibold">{service.name}</p>
            </div>
            <div className="col-span-1">
              <p className="font-semibold">{service.billingMode}</p>
            </div>
            <div className="col-span-1 flex items-center gap-x-5">
              <CustomTextField
                type="number" // Ensure it's a number input
                className="w-fit"
                value={service.quantity || ''} // Ensure it shows the correct quantity
                onChange={(e) => {
                  const newQty = Number(e.target.value);
                  handleQuantityChange(index, newQty); // Call the handler
                }}
                min="1" // Prevent negative quantities
                placeholder="1"
              />
            </div>
            <div className="col-span-2 flex items-center justify-center gap-x-2">
              <CustomTextField
                type="number" // Ensure it's a number input
                className="w-fit"
                value={service.price || ''} // Ensure it shows the correct price
                onChange={(e) => {
                  const newPrice = Number(e.target.value);
                  handlePriceChange(index, newPrice); // Call the handler
                }}
                min="0" // Prevent negative prices
                placeholder={`${service.price} $`}
              />
            </div>
            <div className="col-span-1 flex justify-end">
              <p className="font-semibold">{service.totalPrice} $</p>
            </div>
          </div>
        ))
      ) : (
        <p>No services available</p>
      )}
    </div>
  );
};

export default ProposalInvoice;
