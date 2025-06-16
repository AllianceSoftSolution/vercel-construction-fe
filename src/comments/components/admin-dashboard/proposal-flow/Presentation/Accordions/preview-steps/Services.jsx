import React from "react";

const Services = ({values, client}) => {
  const proposalServices = JSON.parse(localStorage.getItem('proposalServices'))
  
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <h5 className="font-semibold leading-tight">
        {client?.personalInfo?.name}
        </h5>
        <p className="text-black/50 leading-tight text-sm">Client Name</p>
      </div>
      <hr className="border-black" />
      <div className="flex flex-col gap-y-3">
        <h5 className="leading-tight text-lg">Services</h5>
        {
          proposalServices.map((e)=>(
            <div className="service ">
          <h2 className="w-full bg-[#0074BD]/20 rounded-md py-2 px-3">
            {e.name}
          </h2>
          <p className="p-4 text-sm">
          <p dangerouslySetInnerHTML={{ __html: e?.description }}></p>
          </p>
        </div>
          ))
        }
        {/* <p className="text-sm leading-tight">
          Hi Space Ranger (demo client), <br /> <br />
          Here's our proposal for you to review and sign based on an assessment
          of your current wants and needs. <br /> <br /> The review acceptance
          flow is very intuitive and will allow you to step through the services
          proposed, the scope, and an outline of when those services will be
          provided. We would also draw your attention to any included service
          terms as any fixed prices quoted will be conditional on these terms
          being met. <br /> <br /> You'll also be taken through the pricing
          schedule which outlines our prices for those services. <br /> <br />{" "}
          If this proposal includes options you can review each option by
          clicking 'Select' – your choice does not become final until you
          electronically sign the proposal at the final step. <br /> <br /> If
          you have any queries please let us know.
        </p> */}
      </div>
    </div>
  );
};

export default Services;
