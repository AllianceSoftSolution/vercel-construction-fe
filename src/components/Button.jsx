import React from "react";

function Button({ buttonText, onClick, className }) {
  return (
    <button
      className={`bg-primary text-white px-4 py-2 rounded-lg w-fit text-[16px] ${className}`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}

export default Button;
