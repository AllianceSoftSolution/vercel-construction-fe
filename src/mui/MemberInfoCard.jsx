import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FaWhatsapp } from "react-icons/fa";

const MemberInfoCard = ({
  title = "General information - Store Head",
  image,
  name,
  phone,
  role,
  email,
  joiningDate,
  id,
  address,
  country,
  linkedStores = [],
}) => (
  <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 w-[50%] h-fit mt-6">
    {/* Title */}
    <div className="flex justify-between items-start">
      <h3 className="text-[#BF1017] text-xl font-semibold">{title}</h3>
      <MoreVertIcon className="w-6 h-6 bg-[#F7F7F7] rounded-md cursor-pointer" />
    </div>

    {/* Content */}
    <div className="flex mt-6 flex-col">
      {/* Left Side: Profile */}
      <div className="flex flex-col items-start w-[35%]">
        <div className="w-[90px] h-[90px] border-[0.5px] border-[#CDC9C9] rounded-full overflow-hidden">
          <img
            src={image}
            alt="manager"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-sm font-semibold mt-2">{name}</h3>
        <div className="flex items-start mt-1">
          <FaWhatsapp className="w-5 h-5 text-green-500 mr-1 mt-[2px]" />
          <span className="text-sm text-[#5A5A5A] leading-[18px]">{phone}</span>
        </div>
      </div>

      <div className="flex">
        <Info label="Member Role" value={role} />
        <Info label="Email" value={email} />
      </div>
      <div className="flex justify-between">
        <Info label="Joining Date" value={joiningDate} />
        <Info label="ID" value={id} />
      </div>
      <div className="flex justify-between">
        <Info label="Address" value={address} />
        <Info label="Country" value={country} />
      </div>
      <div className="flex justify-between">
        <Info
          label="Linked Store"
          value={linkedStores.length ? linkedStores.join(", ") : "N/A"}
          fullWidth
        />
      </div>
    </div>
  </div>
);

const Info = ({ label, value, fullWidth }) => (
  <div className={`flex flex-col ${fullWidth ? "w-full" : "w-[48%]"}`}>
    <span className="text-[#979797]">{label}</span>
    <span className="text-[#000000] font-medium">{value}</span>
  </div>
);

export default MemberInfoCard;
