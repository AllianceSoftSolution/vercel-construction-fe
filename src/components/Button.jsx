import React from "react";

function Button({ buttonText, onClick, className }) {
  return (
    <button
      className={`bg-primary text-white px-6 py-1 text-[16px] rounded-lg w-fit ${className}`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}

export default Button;
