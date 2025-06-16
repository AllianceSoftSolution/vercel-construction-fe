import { toast } from "react-toastify";

const handleErrors = (errorObject) => {
  for (const field in errorObject) {
    const errors = errorObject[field];
    if (Array.isArray(errors) && errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error);
      });
    }
  }
};
export default handleErrors;
// function processErrors(errors) {
//   const errorMessages = [];

//   function processFieldErrors(field, fieldValue) {
//     if (Array.isArray(fieldValue)) {
//       const joinedMessage = fieldValue.join(' ');
//       errorMessages.push({ field, message: joinedMessage });
//     } else if (typeof fieldValue === 'object') {
//       Object.keys(fieldValue).forEach((key) => {
//         const newField = field ? `${field}.${key}` : key;
//         processFieldErrors(newField, fieldValue[key]);
//       });
//     } else if (typeof fieldValue === 'string') {
//       errorMessages.push({ field, message: fieldValue });
//     }
//   }

//   processFieldErrors('', errors);
//   errorMessages.forEach((error) => {
//     toast.error(error.field=="non_field_errors"?error.message:(`${error.field}:${error.message}`));
//   });
// }
// const errors = {
//   attachment: [
//     "The submitted data was not a file.",
//     "Check the encoding type on the form."
//   ],
//   non_field_errors: ["This candidate already submitted match for this job."],
// };

// processErrors(errors);
function processErrors(errors, field = "") {
  if (Array.isArray(errors)) {
    const joinedMessage = errors.join(" ");
    if (field !== "non_field_errors") toast.error(`${field}: ${joinedMessage}`);
    else toast.error(joinedMessage);
  } else if (typeof errors === "object" && errors !== null) {
    Object.entries(errors).forEach(([key, value]) => {
      const newField = field ? `${field}.${key}` : key;
      processErrors(value, newField);
    });
  }
   else if (typeof errors === "string") {

     toast.error(errors.slice(0,150));
  }
}

// Example usage

export { processErrors };
