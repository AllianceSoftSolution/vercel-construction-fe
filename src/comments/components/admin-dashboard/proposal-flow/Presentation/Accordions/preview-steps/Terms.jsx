import React from "react";

const Terms = ({ values, client }) => {
  const proposalServices = JSON.parse(
    localStorage.getItem("proposalTermsData")
  );
  const proposalName = localStorage.getItem("purposalName");
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <h5 className="font-semibold leading-tight">{proposalName}</h5>
        <p className="text-black/50 leading-tight text-sm">
          {client?.personalInfo.name}
        </p>
      </div>
      <hr className="border-black" />
      <div className="flex flex-col gap-y-3">
        {/* <h5 className="leading-tight text-lg">Terms</h5> */}
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: proposalServices?.description }}
        ></div>
      </div>
    </div>
  );
};

export default Terms;
