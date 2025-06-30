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
  <div className="border border-[#CDC9C9] rounded-2xl p-4 w-full sm:w-[90%] md:w-[80%] lg:w-[60%] h-fit mt-6 mx-auto bg-white ">
    <div className="flex justify-between items-start flex-wrap">
      <h3 className="text-[#BF1017] text-lg sm:text-xl font-semibold">{title}</h3>
      <MoreVertIcon className="w-6 h-6 bg-[#F7F7F7] rounded-md cursor-pointer mt-2 sm:mt-0" />
    </div>

    <div className="flex flex-col sm:flex-row gap-6 mt-6">
      {/* Image & Contact Section */}
      <div className="flex flex-col items-center sm:items-start sm:w-[35%] w-full">
        <div className="w-[90px] h-[90px] border border-[#CDC9C9] rounded-full overflow-hidden">
          <img
            src={image}
            alt="manager"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-sm font-semibold mt-3 text-center sm:text-left">{name}</h3>
        <div className="flex items-center mt-1 text-sm text-[#5A5A5A]">
          <FaWhatsapp className="text-green-500 mr-2" />
          <span>{phone}</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Info label="Member Role" value={role} />
          <Info label="Email" value={email} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Info label="Joining Date" value={joiningDate} />
          <Info label="ID" value={id} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Info label="Address" value={address} />
          <Info label="Country" value={country} />
        </div>
        <div className="flex">
          <Info
            label="Linked Store"
            value={linkedStores.length ? linkedStores.join(", ") : "N/A"}
            fullWidth
          />
        </div>
      </div>
    </div>
  </div>
);

const Info = ({ label, value, fullWidth }) => (
  <div className={`flex flex-col ${fullWidth ? "w-full" : "w-full sm:w-[48%]"}`}>
    <span className="text-[#979797] text-sm">{label}</span>
    <span className="text-[#000000] font-medium text-sm break-words">{value}</span>
  </div>
);

export default MemberInfoCard;
