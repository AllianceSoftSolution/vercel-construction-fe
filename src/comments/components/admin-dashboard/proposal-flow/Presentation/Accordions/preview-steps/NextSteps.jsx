import React from "react";

const NextSteps = ({values, client}) => {
  const proposalName = localStorage.getItem('purposalName');
  console.log(values,'ppppppppppppppp')
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
        
        <p dangerouslySetInnerHTML={{ __html: values?.nextSteps?.message?.body }}></p>
        {values?.nextSteps?.video && <p><span className="font-bold">Video Link:</span> {values?.nextSteps?.video}</p>}

      </div>
      {/* <div className="w-full bg-[#0074bd] text-white p-5 rounded-xl">
        <h3 className="font-bold">Proposal signed!</h3>
      </div>
      <div className="w-full leading-tight text-sm">
        <p className="mb-2 font-semibold">
          Your proposal was successfully accepted.
        </p>
        <p>
          Please read the next steps below and check your confirmation email.
          We'll be in touch soon.
        </p>
      </div> */}
    </div>
  );
};

export default NextSteps;
