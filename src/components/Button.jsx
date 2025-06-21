import React from "react";

function Button({ buttonText, onClick }) {
  return (
    <button
      className="bg-primary text-white px-4 py-2 rounded-lg w-fit"
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}

export default Button;
