export const calculateFederalTaxSavings = (
  planAmount,
  actualAmount,
  federalAssociatedRate
) => {
  const federalTaxSaved =
    (planAmount - actualAmount) * (federalAssociatedRate / 100);
  return federalTaxSaved;
};

// export const calculateStateTaxSavings = (
//   planAmount,
//   actualAmount,
//   stateAssociatedRate
// ) => {
//   const stateTaxSaved =
//     (planAmount - actualAmount) * (stateAssociatedRate / 100);
//   return stateTaxSaved;
// };


export const getValueOfTheFedRate = (taxPlanData, fedAssociatedRateSnake,configOption=null) => {
   let fedAssociatedRate = toCamelCase(fedAssociatedRateSnake)

  if(configOption &&  configOption==='no-mod'){
  fedAssociatedRate = fedAssociatedRateSnake
  console.log("Tax Plan Data Object aaaa -->", fedAssociatedRate +";;;;;" ,taxPlanData);
}
  
    try {
      if (!taxPlanData || typeof taxPlanData !== "object") {
        throw new Error("Invalid taxPlanData object");
      }
      if (taxPlanData.hasOwnProperty(fedAssociatedRate)) {
        return taxPlanData[fedAssociatedRate] || 0;
      }
      if (taxPlanData.customRate && taxPlanData.customRate.length > 0) {
        const foundCustomRate = taxPlanData.customRate.find(
          (customRate) => customRate.name === fedAssociatedRate
        );
        console.log("custom found rate 👌👌", foundCustomRate);
        if (foundCustomRate) {
          return foundCustomRate.rate;
        }
      }
  
      return 0;
    } catch (error) {
      console.error("Error in getValueOfTheFedRate:", error.message);
      return 0;
    }
  };


// export const getValueOfTheFedRate = (taxPlanData, fedAssociatedRate) => {
//   // console.log("Tax Plan Data Object", taxPlanData);
//   try {
//     if (!taxPlanData || typeof taxPlanData !== "object") {
//       throw new Error("Invalid taxPlanData object");
//     }
//     if (taxPlanData.hasOwnProperty(fedAssociatedRate)) {
//       return taxPlanData[fedAssociatedRate] || 0;
//     }
//     if (taxPlanData.custom_rate && taxPlanData.custom_rate.length > 0) {
//       const foundCustomRate = taxPlanData.custom_rate.find(
//         (customRate) => customRate.name === fedAssociatedRate
//       );
//       console.log("custom found rate 👌👌", foundCustomRate);
//       if (foundCustomRate) {
//         return foundCustomRate.rate;
//       }
//     }

//     return 0;
//   } catch (error) {
//     console.error("Error in getValueOfTheFedRate:", error.message);
//     return 0;
//   }
// };

export const getValueOfTheStateRate = (taxPlanData, stateAssociatedRateSnake,configOption=null) => {
  // console.log("Tax Plan Data Object", taxPlanData ,stateAssociatedRate);
  let stateAssociatedRate = toCamelCase(stateAssociatedRateSnake)

  if(configOption &&  configOption==='no-mod'){
    stateAssociatedRate = stateAssociatedRateSnake
    console.log("Tax Plan Data Object aaaa -->", stateAssociatedRateSnake +";;;;;" ,taxPlanData);
  }



  try {
    if (!taxPlanData || typeof taxPlanData !== "object") {
      throw new Error("Invalid taxPlanData object");
    }

    if (taxPlanData.hasOwnProperty(stateAssociatedRate)) {
      return taxPlanData[stateAssociatedRate] || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error in getValueOfTheStateRate:", error.message);
    return 0;
  }
};

export const calculateFedTaxSavings = (
  totalTax,
  taxableIncome,
  rateType,
  rate,
  actualAmount
) => {
  let taxRate;
  console.log(
    "Tracker 22",
    totalTax,
    taxableIncome,
    rateType,
    rate,
    actualAmount
  );

  // Calculate the tax rate based on the type
  if (rateType === "effective_rate") {
    // taxRate = Math.round(totalTax / taxableIncome);
    taxRate = rate;
  } else if (rateType === "marginal_rate") {
    taxRate = rate;
  } else if (rateType === "c_corp_flat_rate") {
    taxRate = rate;
  } else if (rateType === "cap_gains_rate") {
    taxRate = rate;
  } else if (rateType === "non_deductible") {
    taxRate = 0;
  } else {
    taxRate = rate;
    // console.error("Invalid rate type. Please use 'effective' or 'marginal'.");
    // return;
    // throw new Error("Invalid rate type. Please use 'effective' or 'marginal'.");
  }

  // Calculate the tax savings
  const taxSavings = actualAmount * taxRate;
  // alert(JSON.stringify(taxRate))

  return taxSavings;
};



export const calculateStateTaxSavings = (rate, actualAmount) => {
  rate = rate / 100;

  // Calculate the savings
  const taxSavings = actualAmount * rate;

  return taxSavings;
};
// export const calculateFedTaxSavings = (
//   totalTax,
//   taxableIncome,
//   rateType,
//   rate,
//   actualAmount
// ) => {
//   let taxRate;

//   // Calculate the tax rate based on the type
//   if (rateType === "effective_rate") {
//     taxRate = totalTax / taxableIncome;
//   } else if (rateType === "marginal_rate") {
//     taxRate = rate;
//   } else if (rateType === "c_corp_flat_rate") {
//     taxRate = rate;
//   } else if (rateType === "cap_gains_rate") {
//     taxRate = rate;
//   } else if (rateType === "non_deductible") {
//     taxRate = 0;
//   } else {
//     taxRate = rate;
//     // console.error("Invalid rate type. Please use 'effective' or 'marginal'.");
//     // return;
//     // throw new Error("Invalid rate type. Please use 'effective' or 'marginal'.");
//   }

//   // Calculate the tax savings
//   const taxSavings = actualAmount * taxRate;
//   return taxSavings;
// };
function toCamelCase(snakeStr) {
  return snakeStr?.toLowerCase()?.replace(/(_\w)/g, (match) => {
    return match[1]?.toUpperCase();
  });
}