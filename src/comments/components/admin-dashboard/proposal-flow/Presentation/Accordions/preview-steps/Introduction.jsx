import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";

const Introduction = ({values, client}) => {
  console.log(values, 'pppppppppppppp')
  const [imagePreview, setImagePreview] = useState(null);
  const proposalName = localStorage.getItem('purposalName');
  
  

  useEffect(()=>{
    if (values?.introductionImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(values.introductionImage); // Read the file as Data URL
    }
  
  },[values])
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <h5 className="font-semibold leading-tight">
          {proposalName}
        </h5>
        <p className="text-black/50 leading-tight text-sm">{client?.personalInfo?.name}</p>
      </div>
      <hr className="border-black" />
      <div className="flex flex-col gap-y-3">
        {/* <h5 className="leading-tight ">{client?.personalInfo?.name}</h5> */}
        
        <p dangerouslySetInnerHTML={{ __html: values?.introductionPage?.messageTemplate?.body }}></p>
        {values?.introductionPage?.introductionVideo && <p><span className="font-bold">Video Link:</span> {values?.introductionPage?.introductionVideo}</p>}
        {values?.introductionBrochure && <p><span className="font-bold">Brochure:</span> {values?.introductionBrochure.name}</p>}
        {imagePreview && <Avatar src={imagePreview} style={{width: "100%",minHeight: 200 , borderRadius: 10, objectFit:"cover"}} />}

        {/* <p className="text-sm leading-tight">
          Hi Space Ranger (demo client), <br /> <br />
          Here's our proposal for you to review and sign based on an assessment
          of your current wants and needs. <br /> <br /> The review acceptance
          flow is very intuitive and will allow you to step through the services
          proposed, the scope, and an outline of when those services will be
          provided. We would also draw your attention to any included service
          terms as any fixed prices quoted will be conditional on these terms
          being met. <br /> <br /> You'll also be taken through the pricing schedule
          which outlines our prices for those services. <br /> <br /> If this proposal
          includes options you can review each option by clicking 'Select' –
          your choice does not become final until you electronically sign the
          proposal at the final step. <br /> <br /> If you have any queries please let
          us know.
        </p> */}
      </div>
    </div>
  );
};

export default Introduction;
