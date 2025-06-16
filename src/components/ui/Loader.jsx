import React from "react";

const Loader = () => {
    return (
        <div className="absolute inset-0 flex  pt-[100px] items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );
};

export default Loader;