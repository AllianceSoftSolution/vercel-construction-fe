import React from "react";
import noTableDataImage from "../assets/no-data-found.png";

const NoTableDataFound = () => {
  return (
    <div className="flex items-center justify-center flex-col w-full p-5 select-none">
      <img src={noTableDataImage} alt="no data image" className="w-[200px]" />
      <p className="font-medium">No Data Found</p>
      <p>Try changing search terms</p>
    </div>
  );
};

export default NoTableDataFound;
