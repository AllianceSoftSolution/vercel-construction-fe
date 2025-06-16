import React, { useState } from "react";
import {
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
  HiOutlinePlusSm,
} from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SearchAndFilterbar = ({
  setClientsArray,
  callFrom,
  count,
  setSearchValue,
  searchValue,
}) => {
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const handleClientModalOpen = () => setClientModalOpen(true);
  const handleClientModalClose = () => setClientModalOpen(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-white  p-4 flex flex-col gap-y-2">
        <div className="flex  items-center justify-between flex-col md:flex-row gap-y-2">
          <div className="flex gap-3">
            <div className="left-search   flex items-center">
              <input
                type="text"
                className="border py-2 px-5 outline-none focus:border-black/30 rounded-full "
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            {callFrom === "AdminTemplateTerms" ? (
              <></>
            ) : (
              <>
                {/* <button className="flex items-center justify-center bg-[#0074BD33] p-2 rounded-md">
<IoFilterOutline  size={20} /> &nbsp; More Filter
</button> */}
                {/* <button
                  className="flex text-sm text-[gray] items-center justify-center bg-[white] p-2 rounded-md"
                  onClick={() => setSearchValue("")}
                >
                  Clear Filter
                </button> */}
              </>
            )}
          </div>

          {callFrom === "AdminTemplateTerms" ? (
            <>
              <button className="flex items-center text-white justify-center bg-[#0074BD] p-2 rounded-md">
                + New Template
              </button>
            </>
          ) : (
            <div className="right-actions  flex items-center gap-2">
              {/* <button className="flex items-center justify-center bg-[#0074BD33] p-2 rounded-md">
                <HiOutlineArrowSmUp /> Export
              </button>
              <button className="flex items-center justify-center bg-[#0074BD33] p-2 rounded-md">
                <HiOutlineArrowSmDown />
                Import
              </button> */}

              <button
                onClick={() => {
                  navigate("/admin-dashboard/services/create-service", {
                    state: {
                      id: false,
                      mode: "create",
                    },
                  });
                }}
                className="flex items-center justify-center bg-[#0074BD] text-white p-2 rounded-md text-nowrap"
              >
                <HiOutlinePlusSm />
                New Service
              </button>
            </div>
          )}
        </div>
        <p>{count} results</p>
      </div>
    </>
  );
};

export default SearchAndFilterbar;
