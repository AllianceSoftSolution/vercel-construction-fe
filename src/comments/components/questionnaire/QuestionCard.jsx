import React from "react";

const QuestionCard = ({ data, onAdd, onDelete }) => {
  console.log("data", data);
  return (
    <div className="p-4 bg-white shadow-md rounded-md mb-4 flex">
      <div className="w-[70%] flex flex-col">
        <div dangerouslySetInnerHTML={data?.question}></div>
        <div className="mt-2 flex justify-between">
          {/* <button
          onClick={onAdd}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          Add Question
        </button> */}
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="w-[30%]">
        <p>{data.question_type}</p>
      </div>
    </div>
  );
};

export default QuestionCard;
