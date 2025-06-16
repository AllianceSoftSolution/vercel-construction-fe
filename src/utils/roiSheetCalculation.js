import {
  getValueOfTheFedRate,
  getValueOfTheStateRate,
} from "./taxCalculationFunctions";

export const calculateROI = (strategies, taxPlan, filter) => {
  strategies = strategies.map((strategy) => {
    return {
      ...strategy,
      fed_tax_savings: strategy.federal_tax_savings,
    };
  });
  console.log(
    "🚀 ~ file: roiSheetCalculation.js:calculateROI ~ taxPlan/strategies",
    taxPlan,
    strategies
  );
  let roiData = {};
  let opportunites = [];
  let opportunitesForYear02AndForward = [];
  strategies.map((strategy) => {
    if (strategy.start_year === strategy.end_year) {
      // console.log("Tracker", strategy);
      const { federal_associated_rate, state_associated_rate } = strategy;
      const fedRateValue = getValueOfTheFedRate(
        taxPlan,
        federal_associated_rate,
        "no-mod"
      );
      const stateRateValue = getValueOfTheStateRate(
        taxPlan,
        state_associated_rate,
        "no-mod"
      );

      const sumOfRates = fedRateValue + stateRateValue;
      const planAmountOpportunity = (sumOfRates / 100) * strategy.plan_amount;
      const actualAmountOpportunity =
        (sumOfRates / 100) * strategy.actual_amount;
      const differenceInDollars =
        actualAmountOpportunity - planAmountOpportunity;

      console.log(
        "difference in dollars",
        differenceInDollars,
        "plan amount opportunity",
        planAmountOpportunity
      );
      const differenceInPercentage =
        (differenceInDollars / planAmountOpportunity) * 100;
      console.log(planAmountOpportunity);
      console.log("differenceInPercentage", differenceInPercentage);
      // alert(strategy.strategy)
      opportunites.push({
        strategy: strategy.strategy_name,
        category: strategy.category,
        payor: strategy.payor,
        plan: Math.round(planAmountOpportunity),
        actual: Math.round(actualAmountOpportunity),
        changeInDollars: Math.round(differenceInDollars),
        changeInPercentage: Math.round(differenceInPercentage),
      });
    } else if (strategy.start_year !== strategy.end_year) {
      console.log("ROI SHeet Strategy", strategy);
      const { federal_associated_rate, state_associated_rate } = strategy;
      const fedRateValue = getValueOfTheFedRate(
        taxPlan,
        federal_associated_rate,
        "no-mod"
      );
      const stateRateValue = getValueOfTheStateRate(
        taxPlan,
        state_associated_rate,
        "no-mod"
      );

      // alert(stateRateValue + " " + fedRateValue)

      const sumOfRates = fedRateValue + stateRateValue;
      const planAmountOpportunity = (sumOfRates / 100) * strategy.plan_amount;
      const actualAmountOpportunity =
        (sumOfRates / 100) * strategy.actual_amount;
      const differenceInDollars =
        actualAmountOpportunity - planAmountOpportunity;
      console.log(
        "difference in dollars",
        differenceInDollars,
        "plan amount opportunity",
        planAmountOpportunity
      );

      const differenceInPercentage =
        (differenceInDollars / planAmountOpportunity) * 100;
      console.log(planAmountOpportunity);
      console.log("differenceInPercentage", differenceInPercentage);
      opportunitesForYear02AndForward.push({
        strategy: strategy.strategy_name,
        category: strategy.category,
        payor: strategy.payor,
        plan: Math.round(planAmountOpportunity),
        actual: Math.round(actualAmountOpportunity),
        changeInDollars: Math.round(differenceInDollars),
        changeInPercentage: Math.round(differenceInPercentage),
      });
    }
  });

  if (filter === "category") {
    const strategiesWithSameCategories = opportunites.reduce((acc, cur) => {
      // Find if there is already an entry in the accumulator for the same category
      const existingCategory = acc.find((s) => s.category === cur.category);

      // alert('HGi')

      if (existingCategory) {
        // If the category is the same, accumulate the values
        existingCategory.plan += cur.plan;
        existingCategory.actual += cur.actual;
        existingCategory.changeInDollars += cur.changeInDollars;
      } else {
        // Otherwise, add a new entry to the accumulator with just the category and values
        acc.push({
          category: cur.category,
          plan: cur.plan,
          actual: cur.actual,
          changeInDollars: cur.changeInDollars,
          changeInPercentage: 0, // Placeholder, will calculate later
        });
      }
      return acc;
    }, []);

    // Calculate changeInPercentage after accumulating all values
    strategiesWithSameCategories.forEach((category) => {
      category.changeInPercentage = Math.round(
        (category.changeInDollars / category.plan) * 100
      );
    });

    console.log("Strategies same category", strategiesWithSameCategories);

    opportunites = strategiesWithSameCategories;
  } else if (filter === "related_parties") {
    const strategiesWithSamePayor = opportunites.reduce((acc, cur) => {
      // Find if there is already an entry in the accumulator for the same category
      const existingCategory = acc.find((s) => s.payor === cur.payor);

      if (existingCategory) {
        // If the category is the same, accumulate the value
        existingCategory.plan += cur.plan;
        existingCategory.actual += cur.actual;
        existingCategory.changeInDollars += cur.changeInDollars;
        // existingCategory.changeInPercentage += cur.changeInPercentage;
      } else {
        // Otherwise, add a new entry to the accumulator with just the category and value
        acc.push({
          payor: cur.payor,
          plan: cur.plan,
          actual: cur.actual,
          changeInDollars: cur.changeInDollars,
          changeInPercentage: 0,
        });
      }

      return acc;
    }, []);

    strategiesWithSamePayor.forEach((rel_parties) => {
      rel_parties.changeInPercentage = Math.round(
        (rel_parties.changeInDollars / rel_parties.plan) * 100
      );
    });
    console.log("Strategies same payor", strategiesWithSamePayor);

    opportunites = strategiesWithSamePayor;
  } else {
    const strategiesWithSameNames = opportunites.reduce((acc, cur) => {
      const existingStrategy = acc.find((s) => s.strategy === cur.strategy);
      if (existingStrategy) {
        existingStrategy.plan += cur.plan;
        existingStrategy.actual += cur.actual;
        existingStrategy.changeInDollars += cur.changeInDollars;
        // existingStrategy.changeInPercentage += cur.changeInPercentage;
      } else {
        acc.push({
          strategy: cur.strategy,
          plan: cur.plan,
          actual: cur.actual,
          changeInDollars: cur.changeInDollars,
          changeInPercentage: 0,
        });
      }

      return acc;
    }, []);

    strategiesWithSameNames.forEach((name) => {
      name.changeInPercentage = Math.round(
        (name.changeInDollars / name.plan) * 100
      );
    });
    opportunites = strategiesWithSameNames;
  }
  // for year 02 and forward
  if (filter === "category") {
    const strategiesWithSameCategories = opportunitesForYear02AndForward.reduce(
      (acc, cur) => {
        // Find if there is already an entry in the accumulator for the same category
        const existingCategory = acc.find((s) => s.category === cur.category);

        if (existingCategory) {
          // If the category is the same, accumulate the values
          existingCategory.plan += cur.plan;
          existingCategory.actual += cur.actual;
          existingCategory.changeInDollars += cur.changeInDollars;
        } else {
          // Otherwise, add a new entry to the accumulator with just the category and values
          acc.push({
            category: cur.category,
            plan: cur.plan,
            actual: cur.actual,
            changeInDollars: cur.changeInDollars,
            changeInPercentage: 0, // Placeholder, will calculate later
          });
        }
        return acc;
      },
      []
    );

    // Calculate changeInPercentage after accumulating all values
    strategiesWithSameCategories.forEach((category) => {
      category.changeInPercentage = Math.round(
        (category.changeInDollars / category.plan) * 100
      );
    });

    console.log("Strategies same category", strategiesWithSameCategories);

    opportunitesForYear02AndForward = strategiesWithSameCategories;
  } else if (filter === "related_parties") {
    const strategiesWithSamePayor = opportunitesForYear02AndForward.reduce(
      (acc, cur) => {
        // Find if there is already an entry in the accumulator for the same category
        const existingCategory = acc.find((s) => s.payor === cur.payor);

        if (existingCategory) {
          // If the category is the same, accumulate the value
          existingCategory.plan += cur.plan;
          existingCategory.actual += cur.actual;
          existingCategory.changeInDollars += cur.changeInDollars;
          // existingCategory.changeInPercentage += cur.changeInPercentage;
        } else {
          // Otherwise, add a new entry to the accumulator with just the category and value
          acc.push({
            payor: cur.payor,
            plan: cur.plan,
            actual: cur.actual,
            changeInDollars: cur.changeInDollars,
            changeInPercentage: 0,
          });
        }

        return acc;
      },
      []
    );

    strategiesWithSamePayor.forEach((rel_parties) => {
      rel_parties.changeInPercentage = Math.round(
        (rel_parties.changeInDollars / rel_parties.plan) * 100
      );
    });
    console.log("Strategies same payor", strategiesWithSamePayor);

    opportunitesForYear02AndForward = strategiesWithSamePayor;
  } else {
    const strategiesWithSameNames = opportunitesForYear02AndForward.reduce(
      (acc, cur) => {
        const existingStrategy = acc.find((s) => s.strategy === cur.strategy);
        if (existingStrategy) {
          existingStrategy.plan += cur.plan;
          existingStrategy.actual += cur.actual;
          existingStrategy.changeInDollars += cur.changeInDollars;
          // existingStrategy.changeInPercentage += cur.changeInPercentage;
        } else {
          acc.push({
            strategy: cur.strategy,
            plan: cur.plan,
            actual: cur.actual,
            changeInDollars: cur.changeInDollars,
            changeInPercentage: 0,
          });
        }
        return acc;
      },
      []
    );
    // alert(JSON.stringify(strategiesWithSameNames))
    strategiesWithSameNames.forEach((name) => {
      name.changeInPercentage = Math.round(
        (name.changeInDollars / name.plan) * 100
      );
    });
    opportunitesForYear02AndForward = strategiesWithSameNames;
  }
  //   console.log("Opportunities 👌👌", opportunites);
  const totalYear01Savings = opportunites.reduce(
    (accumulator, currentValue) => {
      return {
        plan: accumulator.plan + currentValue.plan,
        actual: accumulator.actual + currentValue.actual,
        changeInDollars:
          accumulator.changeInDollars + currentValue.changeInDollars,
        changeInPercentage:
          accumulator.changeInPercentage + currentValue.changeInPercentage,
      };
    },
    {
      plan: 0,
      actual: 0,
      changeInDollars: 0,
      changeInPercentage: 0,
    }
  );
  const totalYear02AndForwardSavings = opportunitesForYear02AndForward.reduce(
    (accumulator, currentValue) => {
      return {
        plan: accumulator.plan + currentValue.plan,
        actual: accumulator.actual + currentValue.actual,
        changeInDollars:
          accumulator.changeInDollars + currentValue.changeInDollars,
        changeInPercentage:
          accumulator.changeInPercentage + currentValue.changeInPercentage,
      };
    },
    {
      plan: 0,
      actual: 0,
      changeInDollars: 0,
      changeInPercentage: 0,
    }
  );

  // Your investment in the firm ( fees )
  let fees = [];
  Array.isArray(taxPlan?.fees) &&
    taxPlan.fees.map((fee, i) => {
      console.log("Roi Fee", i, fee);
      let feeAmount = 0;
      if (fee.type === "recurring" && fee.frequency === "monthly") {
        feeAmount = fee.amount * 12;
      } else if (fee.type === "priceless") {
        feeAmount = 0;
      } else {
        feeAmount = fee.amount;
      }
      let rate = getValueOfTheFedRate(taxPlan, fee.rate);
      rate = rate / 100;
      fees.push({
        amount: feeAmount,
        afterTaxAmount: Math.round(feeAmount - feeAmount * rate),
        your_investment: feeAmount,
        isPriceless: fee.type === "priceless",
      });
    });
  const netDeductibleIncreaseInInvestementToUs = fees.reduce(
    (accumulator, currentValue) => accumulator + currentValue.your_investment,
    0
  );

  const totalAfterTaxInvestment = fees.reduce(
    (accumulator, currentValue) => accumulator + currentValue.afterTaxAmount,
    0
  );
  const totalAfterTaxInvestmentForYear02andForward = fees.reduce(
    (accumulator, currentValue) => accumulator + currentValue.afterTaxAmount,
    0
  );

  // Charging fee based on the 350$ per plan per client per month
  let actualFeeAccordingToSoftwarePerMonth = 350;
  let yearlyFeeAccordingToSoftware = 350 * 12;

  // projected gain on investment calculation
  const projectedGOIPlan = totalYear01Savings.plan - 350 * 12;
  const projectedGOIActual = totalYear01Savings.actual - 350 * 12;
  let projectedGainOnYourInvestmentAfterYear01 = {
    plan: projectedGOIPlan,
    actual: projectedGOIActual,
    changeInDollars: projectedGOIActual - projectedGOIPlan,
    changeInPercentage: 0,
  };

  projectedGainOnYourInvestmentAfterYear01 = {
    ...projectedGainOnYourInvestmentAfterYear01,
    changeInPercentage: Math.round(
      (projectedGainOnYourInvestmentAfterYear01.changeInDollars /
        projectedGOIPlan) *
        100
    ),
  };
  let projectNetSavingsYear02AndForwardPlan =
    totalYear02AndForwardSavings.plan - yearlyFeeAccordingToSoftware;
  let projectNetSavingsYear02AndForwardActual =
    totalYear02AndForwardSavings.actual - yearlyFeeAccordingToSoftware;

  let projectedNetTaxSavingsForYear02AndForward = {
    plan: projectNetSavingsYear02AndForwardPlan,
    actual: projectNetSavingsYear02AndForwardActual,
    changeInDollars:
      projectNetSavingsYear02AndForwardActual -
      projectNetSavingsYear02AndForwardPlan,
    changeInPercentage: 0,
  };

  // roi calculation
  const planRoi = Math.round(
    (projectedGainOnYourInvestmentAfterYear01.plan /
      (totalAfterTaxInvestment === 0 ? 1 : totalAfterTaxInvestment)) *
      100
  );
  const actualRoi = Math.round(
    (projectedGainOnYourInvestmentAfterYear01.actual /
      (totalAfterTaxInvestment === 0 ? 1 : totalAfterTaxInvestment)) *
      100
  );
  const returnOnInvestment = {
    plan: planRoi,
    actual: actualRoi,
    changeInDollars: Math.round(
      (projectedGainOnYourInvestmentAfterYear01.changeInDollars /
        (totalAfterTaxInvestment === 0 ? 1 : totalAfterTaxInvestment)) *
        100
    ),
    changeInPercentage: actualRoi - planRoi,
  };

  // Total tax savings over next 10 years
  let totalSaving10YearPlan =
    projectedGainOnYourInvestmentAfterYear01.plan +
    projectedNetTaxSavingsForYear02AndForward.plan;
  let totalSaving10YearActual =
    projectedGainOnYourInvestmentAfterYear01.actual +
    projectedNetTaxSavingsForYear02AndForward.actual;
  let totalTaxSavingsOverNext10Years = {
    plan: totalSaving10YearPlan,
    actual: totalSaving10YearActual,
    changeInDollars: totalSaving10YearActual - totalSaving10YearPlan,
    changeInPercentage: 0,
  };

  roiData = {
    opportunites,
    year_02_and_forward_opportunities: opportunitesForYear02AndForward,
    total_year_1_tax_savings: totalYear01Savings,
    total_year_02_and_forward_savings: totalYear02AndForwardSavings,
    fees,
    net_deductible_increase_in_investment_to_us:
      netDeductibleIncreaseInInvestementToUs,
    total_after_tax_investment: totalAfterTaxInvestment,
    total_yearly_after_tax_investment_after_year_01:
      yearlyFeeAccordingToSoftware,
    projected_gain_on_your_investment_after_year_01:
      projectedGainOnYourInvestmentAfterYear01,
    projected_net_tax_savings_after_year_01:
      projectedNetTaxSavingsForYear02AndForward,
    return_on_investment: returnOnInvestment,
    actual_fee_according_to_software_per_month:
      actualFeeAccordingToSoftwarePerMonth,
    yearly_fee_according_to_software: yearlyFeeAccordingToSoftware,
    total_tax_savings_over_next_10_years: totalTaxSavingsOverNext10Years,
  };
  // alert(JSON.stringify(roiData))
  console.log("Tracker", roiData);
  return roiData;
};

function camelToSnake(obj) {
  const newObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(
        /([A-Z])/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      newObj[snakeKey] = obj[key];
    }
  }

  return newObj;
}

export function convertCamelToSnake(input) {
  if (Array.isArray(input)) {
    // Handle array of objects
    return input.map((item) => camelToSnake(item));
  } else if (typeof input === "object" && input !== null) {
    // Handle single object
    return camelToSnake(input);
  } else {
    // If input is neither object nor array, return it unchanged
    return input;
  }
}
