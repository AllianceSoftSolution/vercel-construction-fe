// planSlice.js
import { createSlice } from "@reduxjs/toolkit";
const plans = [
  {
    selectedPlanPricingId: "price_1QNpwiE9j8Z5LRZEWIpxP2wq",
    card: {
      title: "Software Only",
      price: 1500,
      popular: false,
      features: [
        "Software Fee",
        "Automated Document Generation",
        "Real-time tax savings dashboard",
        "Secure Data Storage & Encryption",
        "Comprehensive Tax Planning Tools",
        "Include Coaching & Tuition fee",
      ],
    },
    billingCycle: "monthly",
    planType: "Tax Advisors",
    couponCode: null,
  },
  {
    selectedPlanPricingId: "price_1QNpxxE9j8Z5LRZEErCVej5V",
    card: {
      title: "Software + Coaching",
      price: 6500,
      popular: true,
      features: [
        "Software Fee",
        "Automated Document Generation",
        "Real-time tax savings dashboard",
        "Secure Data Storage & Encryption",
        "Comprehensive Tax Planning Tools",
        "Include Coaching & Tuition fee",
      ],
    },
    billingCycle: "monthly",
    planType: "Tax Advisors",
    couponCode: null,
  },
  {
    selectedPlanPricingId: "price_1QNpwiE9j8Z5LRZEoUD4WBXp",
    card: {
      title: "Software Only",
      price: 15000,
      popular: false,
      features: [
        "Software Fee",
        "Automated Document Generation",
        "Real-time tax savings dashboard",
        "Secure Data Storage & Encryption",
        "Comprehensive Tax Planning Tools",
        "Include Coaching & Tuition fee",
      ],
    },
    billingCycle: "yearly",
    planType: "Tax Advisors",
    couponCode: null,
  },
  {
    selectedPlanPricingId: "price_1QNpxxE9j8Z5LRZEVk3n2azF",
    card: {
      title: "Software + Coaching",
      price: 65000,
      popular: true,
      features: [
        "Software Fee",
        "Automated Document Generation",
        "Real-time tax savings dashboard",
        "Secure Data Storage & Encryption",
        "Comprehensive Tax Planning Tools",
        "Include Coaching & Tuition fee",
      ],
    },
    billingCycle: "yearly",
    planType: "Tax Advisors",
    couponCode: null,
  },
  {
    selectedPlanPricingId: "price_1QNpynE9j8Z5LRZEGv7dYKkH",
    card: {
      title: "Software Only",
      price: 1500,
      popular: false,
      features: [
        "Software Fee",
        "Automated Document Generation",
        "Real-time tax savings dashboard",
        "Secure Data Storage & Encryption",
        "Comprehensive Tax Planning Tools",
        "Include Coaching & Tuition fee",
      ],
    },
    billingCycle: "monthly",
    planType: "Accountants",
    couponCode: null,
  },
  {
    selectedPlanPricingId: "price_1QNpzfE9j8Z5LRZEtpKLiddG",
    card: {
      title: "Software + Coaching",
      price: 4500,
      popular: true,
      features: [
        "Software Fee",
        "Automated Document Generation",
        "Real-time tax savings dashboard",
        "Secure Data Storage & Encryption",
        "Comprehensive Tax Planning Tools",
        "Include Coaching & Tuition fee",
      ],
    },
    billingCycle: "monthly",
    planType: "Accountant",
    couponCode: null,
  },
  {
    selectedPlanPricingId: "price_1QNpynE9j8Z5LRZEtOzt17mi",
    card: {
      title: "Software Only",
      price: 15000,
      popular: false,
      features: [
        "Software Fee",
        "Automated Document Generation",
        "Real-time tax savings dashboard",
        "Secure Data Storage & Encryption",
        "Comprehensive Tax Planning Tools",
        "Include Coaching & Tuition fee",
      ],
    },
    billingCycle: "yearly",
    planType: "Accountant",
    couponCode: null,
  },
  {
    selectedPlanPricingId: "price_1QNpzfE9j8Z5LRZEQgFjS5Ww",
    card: {
      title: "Software + Coaching",
      price: 45000,
      popular: true,
      features: [
        "Software Fee",
        "Automated Document Generation",
        "Real-time tax savings dashboard",
        "Secure Data Storage & Encryption",
        "Comprehensive Tax Planning Tools",
        "Include Coaching & Tuition fee",
      ],
    },
    billingCycle: "yearly",
    planType: "Tax Advisors",
    couponCode: null,
  },
];

const planSlice = createSlice({
  name: "plan",
  initialState: plans,
  reducers: {
    setPlanDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Selector functions
export const selectPlanById = (state, id) =>
  state.plan.find((plan) => plan.selectedPlanPricingId === id);

// Select plans by a specific field and value
export const selectPlansByField = (state, field, value) =>
  state.plan.filter((plan) => plan[field] === value);

// Select only the popular plans
export const selectPopularPlans = (state) =>
  state.plan.filter((plan) => plan.card.popular);

// Select plans within a specific price range
export const selectPlansByPriceRange = (state, minPrice, maxPrice) =>
  state.plan.filter(
    (plan) => plan.card.price >= minPrice && plan.card.price <= maxPrice
  );

export const { setPlanDetails } = planSlice.actions;
export default planSlice.reducer;
