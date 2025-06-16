import React from "react";
import { formatDate } from "../../../../../../modules/helpers";

const Pricing = ({values, client}) => {
  const proposalServices = JSON.parse(localStorage.getItem('proposalServices'))
  const proposalName = localStorage.getItem('purposalName');
  const totalPrice = proposalServices.reduce((sum, service) => sum + service.price * (service.qty || 1) , 0);
  const todayDate = new Date()
  console.log(values, 'values')
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <h5 className="font-semibold leading-tight">
          {proposalName}
        </h5>
        <p className="text-black/50 leading-tight text-sm">{client?.personalInfo.name}</p>
      </div>
      <hr className="border-black" />
      <div className="flex flex-col gap-y-3">
        <h5 className="leading-tight text-lg">Pricing</h5>
        {
          proposalServices?.map((e)=>(
            <div className="service flex flex-col gap-y-2">
              {console.log(e)}
          <h2 className="w-full bg-[#0074BD]/10 rounded-md py-2 px-3 flex items-start justify-between text-sm">
            <span>{e.name}</span>
            {values?.pricingPage?.showPricePerService && <span>Quantity: {e.qty || 1}</span>}
            <span className="flex flex-col ">
              <span className="flex gap-5">
                
              {values?.pricingPage?.showPricePerService && <span>${e.price}</span>}
              </span>
              {values?.pricingPage?.showPricePerService && <span className="text-xs">Excl. $0 taxes</span>}
            </span>
          </h2>
        </div>
          ))
        }
      </div>
      <hr />
      <div>
        <div className="flex w-full items-center justify-between">
          <h6>Total price</h6>
          <p className="text-black/50 text-sm">${totalPrice}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <h6>Calculated until: {formatDate(todayDate)}</h6>
          <p className="text-black/50 text-sm">Ex $0.00 in taxes</p>
        </div>
      </div>
      {/* <p className="text-black/50 text-sm">
        Totals exclude prices charged per unit and use the minimum values of
        price ranges.
      </p> */}
    </div>
  );
};

export default Pricing;
