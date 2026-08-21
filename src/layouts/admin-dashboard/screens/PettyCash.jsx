import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Chip, Modal } from "@mui/material";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import {
  AccountBalance,
  FolderOpen,
  Layers,
  Payments,
  ReceiptLong,
  TrendingDown,
} from "@mui/icons-material";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import ExportToExcelButton from "../../../components/ExportToExcelButton";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import CustomTextField from "../../../mui/CustomTextField";
import Button from "../../../components/Button";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import apiClient from "../../../api/apiClient";
import { formatDateDMY } from "../../../utils";
import { useReadOnly } from "../../../context/ReadOnlyContext";
import { isHeadUser } from "../../../utils/userHelpers";
import FileUploadField from "../../../components/ui/FileUploadField";
import AttachmentLinks from "../../../components/ui/AttachmentLinks";
import useS3MultiUpload from "../../../hooks/useS3MultiUpload";
import { UPLOAD_FOLDERS } from "../../../constants/fileUpload";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "560px",
  boxShadow: 24,
  borderRadius: "16px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const TYPE_LABELS = {
  FUNDING: "Distribute to Project",
  DISTRIBUTION: "Distribution",
  INTERNAL_EXPENSE: "Internal Expense",
  SECTION_EXPENSE: "Section Expense",
};

const HO_PA_TYPE_LABELS = {
  ...TYPE_LABELS,
  INTERNAL_EXPENSE: "Project Internal Expense",
  SECTION_EXPENSE: "Section Internal Expense",
};

const PETTY_CASH_TYPES_BY_ROLE = {
  SECTION_ACCOUNTANT: ["DISTRIBUTION", "SECTION_EXPENSE"],
  PROJECT_MANAGER: [
    "FUNDING",
    "DISTRIBUTION",
    "INTERNAL_EXPENSE",
    "SECTION_EXPENSE",
  ],
  PROJECT_ACCOUNTANT: [
    "FUNDING",
    "DISTRIBUTION",
    "INTERNAL_EXPENSE",
    "SECTION_EXPENSE",
  ],
  HEAD_OFFICE: [
    "FUNDING",
    "DISTRIBUTION",
    "INTERNAL_EXPENSE",
    "SECTION_EXPENSE",
  ],
};

const PETTY_CASH_TYPES_BY_SCOPE = {
  project: ["FUNDING", "INTERNAL_EXPENSE"],
  pm_project: ["INTERNAL_EXPENSE"],
  sections: ["DISTRIBUTION", "SECTION_EXPENSE"],
  all_project: [
    "FUNDING",
    "DISTRIBUTION",
    "INTERNAL_EXPENSE",
    "SECTION_EXPENSE",
  ],
};

const PROJECT_LEVEL_TX_TYPES = new Set(["FUNDING", "INTERNAL_EXPENSE"]);
const SECTION_LEVEL_TX_TYPES = new Set(["DISTRIBUTION", "SECTION_EXPENSE"]);

const mapTypeOptions = (types, labels = TYPE_LABELS) =>
  types.map((value) => ({ value, label: labels[value] || value }));

const PETTY_CASH_ACTORS_BY_ROLE = {
  SECTION_ACCOUNTANT: [
    "Head Office Accountant",
    "Project Accountant",
    "Section Accountant",
  ],
  PROJECT_MANAGER: [
    "Head Office Accountant",
    "Project Accountant",
    "Section Accountant",
  ],
  PROJECT_ACCOUNTANT: [
    "Head Office Accountant",
    "Project Accountant",
    "Section Accountant",
  ],
  HEAD_OFFICE: [
    "Head Office Accountant",
    "Project Accountant",
    "Section Accountant",
  ],
};

const clampNonNegative = (value) => Math.max(0, Number(value) || 0);

const formatAvailableAmount = (value) =>
  `Rs. ${clampNonNegative(value).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const validateAmountWithinBalance = (amount, available, balanceLabel) => {
  const normalizedAvailable = clampNonNegative(available);
  const normalizedAmount = Number(amount);

  if (!normalizedAmount || normalizedAmount <= 0) {
    toast.error("Enter a valid amount");
    return false;
  }
  if (normalizedAvailable <= 0) {
    toast.error(
      `No ${balanceLabel} available. You cannot spend more than the remaining balance.`
    );
    return false;
  }
  if (normalizedAmount > normalizedAvailable) {
    toast.error(
      `Insufficient ${balanceLabel}. Available: ${formatAvailableAmount(normalizedAvailable)}. You cannot consume more than what is remaining.`
    );
    return false;
  }
  return true;
};

const TYPE_CHIP_COLOR = {
  FUNDING: "success",
  DISTRIBUTION: "info",
  INTERNAL_EXPENSE: "warning",
  SECTION_EXPENSE: "error",
};

const formatCurrency = (n) =>
  `Rs. ${Number(n || 0).toLocaleString("en-PK", { minimumFractionDigits: 0 })}`;

const TypeChip = ({ value, labels = TYPE_LABELS }) => {
  const label = labels[value] || value || "-";
  return (
    <Chip
      label={label}
      size="small"
      color={TYPE_CHIP_COLOR[value] || "default"}
      sx={{ fontWeight: 600 }}
    />
  );
};

const ProofLink = ({ value }) => (
  <AttachmentLinks urls={value} linkClassName="text-primary underline text-sm" />
);

/** Theme-aligned action button styles (consistent across all roles) */
const ACTION_BTN_BASE =
  "inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-white text-sm font-semibold whitespace-nowrap shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed";

const ACTION_BTN_STYLES = {
  distributeProject: `${ACTION_BTN_BASE} bg-[#FC8908] hover:bg-[#e07c07] focus:ring-[#FC8908]/50`,
  distributeSection: `${ACTION_BTN_BASE} bg-[#0252AD] hover:bg-[#0248a0] focus:ring-[#0252AD]/50`,
  internalExpense: `${ACTION_BTN_BASE} bg-[#8b5cf6] hover:bg-[#7c4fee] focus:ring-[#8b5cf6]/50`,
  sectionExpense: `${ACTION_BTN_BASE} bg-[#ef4444] hover:bg-[#dc2626] focus:ring-[#ef4444]/50`,
  manageHeads: `${ACTION_BTN_BASE} bg-[#64748b] hover:bg-[#475569] focus:ring-[#64748b]/50`,
};

const PettyCashActionButton = ({ label, styleKey, onClick, disabled }) => (
  <button
    type="button"
    className={ACTION_BTN_STYLES[styleKey]}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

const LOADING_TEXT = "Loading";

const SectionSelectField = ({
  projectId,
  sectionId,
  sectionsLoading,
  sections,
  onChange,
}) => (
  <select
    className="border rounded-lg p-2.5 w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-wait"
    value={sectionId || ""}
    onChange={onChange}
    disabled={!projectId || sectionsLoading}
  >
    <option value="">
      {sectionsLoading
        ? LOADING_TEXT
        : projectId
          ? "Select section"
          : "Select a project first"}
    </option>
    {!sectionsLoading &&
      sections.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
  </select>
);

const ContentLoadingOverlay = ({ show, fullPage, text = LOADING_TEXT }) => {
  if (!show) return null;
  return (
    <div
      className={`${
        fullPage ? "fixed inset-0 z-50" : "absolute inset-0 z-20 rounded-xl"
      } flex items-center justify-center bg-white/75 backdrop-blur-[2px]`}
    >
      <Loader text={text} />
    </div>
  );
};

const PROJECT_ACCENT_COLORS = [
  "#FC8908",
  "#0252AD",
  "#8b5cf6",
  "#22c55e",
  "#0ea5e9",
  "#ef4444",
];

const getProjectAccent = (index) =>
  PROJECT_ACCENT_COLORS[index % PROJECT_ACCENT_COLORS.length];

const PillTabs = ({ tabs, active, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        onClick={() => onChange(tab.id)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
          active === tab.id
            ? "bg-[#0252AD] text-white border-[#0252AD] shadow-sm"
            : "bg-white text-gray-600 border-gray-300 hover:border-[#0252AD] hover:text-[#0252AD]"
        }`}
      >
        {tab.icon}
        {tab.label}
        {tab.badge != null && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              active === tab.id
                ? "bg-white/25 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.badge}
          </span>
        )}
      </button>
    ))}
  </div>
);

const SearchField = ({ value, onChange, placeholder }) => (
  <div className="relative w-56 shrink-0">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
    />
  </div>
);

const formatRole = (role) => {
  if (!role) return "-";
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/** Petty-cash-specific actor label for filters (not raw system role). */
const getPettyCashActorLabel = (creator) => {
  if (!creator?.role) return "";
  if (creator.role === "PROJECT_MANAGER") return "Project Manager";
  if (["ADMIN", "SUPER_ADMIN", "SUB_ADMIN"].includes(creator.role)) {
    return "Head Office Accountant";
  }
  if (creator.role === "ACCOUNTANT") {
    return isHeadUser(creator)
      ? "Project Accountant"
      : "Section Accountant";
  }
  return formatRole(creator.role);
};

const getDistributionSectionAccountantName = (tx) => {
  if (tx.type !== "DISTRIBUTION") return "-";
  if (tx.recipient?.role === "ACCOUNTANT" && !tx.recipient?.isHead) {
    return tx.recipient.name;
  }
  return tx.section?.accountantAssignments?.[0]?.user?.name || "-";
};

const TableFilterSelect = ({ allLabel, options, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-52 shrink-0 px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
  >
    <option value="all">{allLabel}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const isTransactionInDateRange = (createdAt, from, to) => {
  if (!from && !to) return true;
  if (!createdAt) return false;
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return false;
  if (from) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    if (date < start) return false;
  }
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    if (date > end) return false;
  }
  return true;
};

const TableDateRangeFilter = ({ from, to, onFromChange, onToChange, onClear }) => (
  <div className="inline-flex items-center gap-2 shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm">
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0252AD] shrink-0">
      Date
    </span>
    <input
      type="date"
      value={from}
      max={to || undefined}
      onChange={(e) => onFromChange(e.target.value)}
      aria-label="Transaction date from"
      className="w-[8.75rem] shrink-0 px-2 py-2 border border-gray-200 rounded-md text-sm bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#0252AD]/25 focus:border-[#0252AD]/40"
    />
    <span className="text-[11px] font-medium text-gray-400 shrink-0">to</span>
    <input
      type="date"
      value={to}
      min={from || undefined}
      onChange={(e) => onToChange(e.target.value)}
      aria-label="Transaction date to"
      className="w-[8.75rem] shrink-0 px-2 py-2 border border-gray-200 rounded-md text-sm bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#0252AD]/25 focus:border-[#0252AD]/40"
    />
    {(from || to) && (
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-[#FC8908] text-[#FC8908] bg-[#FFF7ED] hover:bg-[#FC8908] hover:text-white transition-colors duration-200"
      >
        <FiX className="text-sm" />
        Clear
      </button>
    )}
  </div>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-14 px-6 bg-white rounded-xl border border-dashed border-gray-200 text-center">
    <div className="h-14 w-14 rounded-full bg-[#FFF7ED] flex items-center justify-center mb-4">
      <Icon className="text-[#FC8908] text-3xl" />
    </div>
    <p className="text-lg font-semibold text-gray-800">{title}</p>
    <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

const TablePanel = ({ title, subtitle, count, search, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-4 py-4 border-b border-gray-100 bg-[#FAFAFA] space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-800 truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        {count != null && (
          <span className="inline-flex items-center justify-center text-xs font-semibold text-[#0252AD] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
            {count} record{count === 1 ? "" : "s"}
          </span>
        )}
      </div>
      {search && (
        <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
          <div className="flex items-center gap-2 flex-nowrap w-max pr-1">
            {search}
          </div>
        </div>
      )}
    </div>
    <div className="p-3 sm:p-4">{children}</div>
  </div>
);

const ProjectListCard = ({
  project,
  index,
  txCount,
  onSelect,
  sectionScopedView = false,
}) => {
  const accent = getProjectAccent(index);

  if (sectionScopedView) {
    const credited = clampNonNegative(
      project.totalCredited ?? project.totalDistributed ?? 0
    );
    const debited = clampNonNegative(
      project.totalDebited ?? project.totalSectionExpenses ?? 0
    );
    const remaining = clampNonNegative(
      project.remainingBalance ?? credited - debited
    );
    const utilization =
      credited > 0 ? Math.min(100, Math.round((debited / credited) * 100)) : 0;

    return (
      <button
        type="button"
        onClick={() => onSelect(project)}
        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex items-center justify-between p-5 text-left w-full group"
        style={{ borderLeft: `5px solid ${accent}` }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-[#0252AD] transition-colors">
              {project.name}
            </h3>
            {project.code && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                {project.code}
              </span>
            )}
            {txCount > 0 && (
              <span className="text-xs font-semibold text-[#0252AD] bg-blue-50 px-2 py-0.5 rounded-full">
                {txCount} txn{txCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                Credited
              </p>
              <p className="text-sm font-semibold text-[#8b5cf6]">
                {formatCurrency(credited)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                Debited
              </p>
              <p className="text-sm font-semibold text-[#ef4444]">
                {formatCurrency(debited)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                Remaining Balance
              </p>
              <p className="text-sm font-semibold text-[#22c55e]">
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>
          {credited > 0 && (
            <div className="mt-3 max-w-md">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Utilization</span>
                <span>{utilization}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ef4444] rounded-full transition-all duration-300"
                  style={{ width: `${utilization}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <FiChevronRight className="text-gray-300 group-hover:text-[#0252AD] text-2xl ml-4 shrink-0 transition-colors" />
      </button>
    );
  }

  const distributed = Number(project.totalDistributed || 0);
  const funded = Number(project.totalFunded || 0);
  const utilization =
    funded > 0 ? Math.min(100, Math.round((distributed / funded) * 100)) : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex items-center justify-between p-5 text-left w-full group"
      style={{ borderLeft: `5px solid ${accent}` }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-[#0252AD] transition-colors">
            {project.name}
          </h3>
          {project.code && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
              {project.code}
            </span>
          )}
          {txCount > 0 && (
            <span className="text-xs font-semibold text-[#0252AD] bg-blue-50 px-2 py-0.5 rounded-full">
              {txCount} txn{txCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              Funded
            </p>
            <p className="text-sm font-semibold text-[#0252AD]">
              {formatCurrency(project.totalFunded)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              Distributed
            </p>
            <p className="text-sm font-semibold text-[#8b5cf6]">
              {formatCurrency(project.totalDistributed)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              Remaining Balance
            </p>
            <p className="text-sm font-semibold text-[#22c55e]">
              {formatCurrency(clampNonNegative(project.projectPoolRemaining))}
            </p>
          </div>
        </div>
        {funded > 0 && (
          <div className="mt-3 max-w-md">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Distribution progress</span>
              <span>{utilization}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8b5cf6] rounded-full transition-all duration-300"
                style={{ width: `${utilization}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <FiChevronRight className="text-gray-300 group-hover:text-[#0252AD] text-2xl ml-4 shrink-0 transition-colors" />
    </button>
  );
};

const SectionListCard = ({ section, index, onSelect }) => {
  const accent = getProjectAccent(index);
  const received = clampNonNegative(section.received);
  const spent = clampNonNegative(section.spent);
  const remaining = clampNonNegative(section.remaining);
  const spentPct =
    received > 0 ? Math.min(100, Math.round((spent / received) * 100)) : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(section)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex items-center justify-between p-5 text-left w-full group"
      style={{ borderLeft: `5px solid ${accent}` }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-[#0252AD] transition-colors">
            {section.name}
          </h3>
          {section.code && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
              {section.code}
            </span>
          )}
          {(section.transactionCount || 0) > 0 && (
            <span className="text-xs font-semibold text-[#0252AD] bg-blue-50 px-2 py-0.5 rounded-full">
              {section.transactionCount} txn
              {section.transactionCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2">
          {section.projectName}
          {section.projectCode ? ` · ${section.projectCode}` : ""}
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              Received
            </p>
            <p className="text-sm font-semibold text-[#8b5cf6]">
              {formatCurrency(received)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              Spent
            </p>
            <p className="text-sm font-semibold text-[#ef4444]">
              {formatCurrency(spent)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              Remaining
            </p>
            <p className="text-sm font-semibold text-[#22c55e]">
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>
        {received > 0 && (
          <div className="mt-3 max-w-md">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Utilization</span>
              <span>{spentPct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ef4444] rounded-full transition-all duration-300"
                style={{ width: `${spentPct}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <FiChevronRight className="text-gray-300 group-hover:text-[#0252AD] text-2xl ml-4 shrink-0 transition-colors" />
    </button>
  );
};

const SectionBalanceCard = ({ section, accent, active, onSelect }) => {
  const received = clampNonNegative(section.received);
  const spent = clampNonNegative(section.spent);
  const remaining = clampNonNegative(section.remaining);
  const spentPct =
    received > 0 ? Math.min(100, Math.round((spent / received) * 100)) : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(section.id)}
      className={`text-left w-full rounded-xl border p-4 transition-all duration-200 ${
        active
          ? "border-[#FC8908] bg-[#FFF7ED] shadow-sm ring-1 ring-[#FC8908]/25"
          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      <p className="font-semibold text-gray-800 truncate">{section.name}</p>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-purple-50 rounded-lg py-2 px-1">
          <p className="text-[10px] text-gray-500 uppercase">Received</p>
          <p className="text-xs font-bold text-[#8b5cf6]">
            {formatCurrency(received)}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg py-2 px-1">
          <p className="text-[10px] text-gray-500 uppercase">Spent</p>
          <p className="text-xs font-bold text-[#ef4444]">
            {formatCurrency(spent)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg py-2 px-1">
          <p className="text-[10px] text-gray-500 uppercase">Left</p>
          <p className="text-xs font-bold text-[#22c55e]">
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>
      {received > 0 && (
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ef4444] rounded-full"
            style={{ width: `${spentPct}%` }}
          />
        </div>
      )}
    </button>
  );
};

const PettyCashModule = ({ fullPageOverlayOnFilter = false }) => {
  const user = useSelector((s) => s.auth.user);
  const isReadOnly = useReadOnly();
  const [summary, setSummary] = useState(null);

  const isAdminRoleUser = useMemo(
    () => ["ADMIN", "SUPER_ADMIN", "SUB_ADMIN"].includes(user?.role),
    [user]
  );

  const isAdmin = useMemo(
    () => ["ADMIN", "SUPER_ADMIN"].includes(user?.role),
    [user]
  );

  const isProjectAccountant = useMemo(
    () =>
      summary?.roleScope === "PROJECT_ACCOUNTANT" ||
      (user?.role === "ACCOUNTANT" &&
        isHeadUser(user) &&
        summary?.roleScope !== "HEAD_OFFICE_ACCOUNTANT"),
    [user, summary?.roleScope]
  );

  const isHeadOffice = useMemo(
    () =>
      isAdminRoleUser || summary?.roleScope === "HEAD_OFFICE_ACCOUNTANT",
    [isAdminRoleUser, summary?.roleScope]
  );

  const isSectionAccountant = useMemo(
    () =>
      summary?.roleScope === "SECTION_ACCOUNTANT" ||
      (user?.role === "ACCOUNTANT" && !isHeadUser(user)),
    [user, summary?.roleScope]
  );

  const isProjectManager = user?.role === "PROJECT_MANAGER";

  const usesSectionScopedMetrics = summary?.viewMode === "section";
  const usesDetailedExpenseNames = isHeadOffice || isProjectAccountant;
  const expenseTypeLabels = usesDetailedExpenseNames
    ? HO_PA_TYPE_LABELS
    : TYPE_LABELS;

  const pettyCashRoleKey = useMemo(() => {
    if (isSectionAccountant) return "SECTION_ACCOUNTANT";
    if (isProjectManager) return "PROJECT_MANAGER";
    if (isProjectAccountant) return "PROJECT_ACCOUNTANT";
    return "HEAD_OFFICE";
  }, [isSectionAccountant, isProjectManager, isProjectAccountant]);

  const [pageLoading, setPageLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const isInitialLoad = React.useRef(true);
  const [projects, setProjects] = useState([]);
  const [assignedSections, setAssignedSections] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [projectBalance, setProjectBalance] = useState(null);
  const [apiFilters, setApiFilters] = useState({});
  const [filter, setFilter] = useState({ Project: [], Section: [] });
  const [activeTab, setActiveTab] = useState(0);
  const [projectSearch, setProjectSearch] = useState("");
  const [sectionSearch, setSectionSearch] = useState("");
  const [txSearch, setTxSearch] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState("all");
  const [txByFilter, setTxByFilter] = useState("all");
  const [txHeadFilter, setTxHeadFilter] = useState("all");
  const [txDateFrom, setTxDateFrom] = useState("");
  const [txDateTo, setTxDateTo] = useState("");
  const [detailTransactionScope, setDetailTransactionScope] =
    useState("all_sections");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [files, setFiles] = useState([]);
  const { uploadFiles, uploading: fileUploading } = useS3MultiUpload();
  const [submitting, setSubmitting] = useState(false);
  const [headForm, setHeadForm] = useState({ name: "", description: "" });
  const [formSections, setFormSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  const accessibleProjects = useMemo(() => {
    if (projects.length > 0) return projects;
    return allProjects;
  }, [projects, allProjects]);

  const loadProjectSections = useCallback(async (projectId) => {
    if (!projectId) {
      setFormSections([]);
      return [];
    }
    setSectionsLoading(true);
    try {
      const res = await apiClient.get(`/petty-cash/projects/${projectId}/sections`);
      if (res.ok) {
        const sections = res.data?.data || [];
        setFormSections(sections);
        return sections;
      }
      setFormSections([]);
      return [];
    } catch {
      setFormSections([]);
      return [];
    } finally {
      setSectionsLoading(false);
    }
  }, []);

  const handleProjectSelect = useCallback(
    async (projectId, resetSection = true) => {
      setForm((prev) => ({
        ...prev,
        projectId,
        ...(resetSection ? { sectionId: "", expenseHeadId: "" } : {}),
      }));
      await loadProjectSections(projectId);
    },
    [loadProjectSections]
  );
  const permissions = useMemo(
    () => ({
      canAddFunding: summary?.canAddFunding ?? isAdminRoleUser,
      canManageHeads: summary?.canManageHeads ?? isAdmin,
      canDistribute:
        summary?.canDistribute ?? (isHeadOffice || isProjectAccountant),
      canAddInternalExpense:
        summary?.canAddInternalExpense ??
        (isHeadOffice || isProjectAccountant || isProjectManager),
      canAddSectionExpense: summary?.canAddSectionExpense ?? false,
    }),
    [summary, isAdminRoleUser, isAdmin, isHeadOffice, isProjectAccountant]
  );

  const projectOptionsForModal = useMemo(() => {
    if (isHeadOffice && allProjects.length > 0) return allProjects;
    return accessibleProjects;
  }, [isHeadOffice, allProjects, accessibleProjects]);

  const fetchData = useCallback(async () => {
    if (isInitialLoad.current) {
      setPageLoading(true);
    } else {
      setContentLoading(true);
    }
    try {
      const summaryQuery = {
        ...apiFilters,
        ...(selectedSection?.id ? { sectionId: selectedSection.id } : {}),
      };
      const txQuery = {
        ...summaryQuery,
        ...(selectedProject?.id ? { projectId: selectedProject.id } : {}),
        ...(txDateFrom ? { dateFrom: txDateFrom } : {}),
        ...(txDateTo ? { dateTo: txDateTo } : {}),
        limit: 500,
      };

      if (isSectionAccountant) {
        const [sumRes, secRes, txRes, headsRes] =
          await Promise.all([
            apiClient.get("/petty-cash/summary", summaryQuery),
            apiClient.get("/petty-cash/summary/by-section", summaryQuery),
            apiClient.get("/petty-cash/transactions", txQuery),
            apiClient.get("/petty-cash/expense-heads"),
          ]);

        if (sumRes.ok) {
          setSummary(sumRes.data?.data || sumRes.data);
        } else {
          toast.error(
            sumRes.data?.message ||
              "Could not load petty cash summary. Ensure database tables are migrated."
          );
        }

        if (secRes.ok) setAssignedSections(secRes.data?.data || []);
        if (txRes.ok) setTransactions(txRes.data?.data || []);
        if (headsRes.ok) setExpenseHeads(headsRes.data?.data || []);
        if (secRes.ok) {
          setAllSections(secRes.data?.data || []);
        }
      } else {
        const [sumRes, projRes, txRes, headsRes, secRes] =
          await Promise.all([
            apiClient.get("/petty-cash/summary", apiFilters),
            apiClient.get("/petty-cash/summary/by-project", apiFilters),
            apiClient.get("/petty-cash/transactions", txQuery),
            apiClient.get("/petty-cash/expense-heads"),
            apiClient.get("/petty-cash/summary/by-section", apiFilters),
          ]);

        if (sumRes.ok) {
          setSummary(sumRes.data?.data || sumRes.data);
        } else {
          toast.error(
            sumRes.data?.message ||
              "Could not load petty cash summary. Ensure database tables are migrated."
          );
        }

        if (projRes.ok) setProjects(projRes.data?.data || []);
        if (txRes.ok) setTransactions(txRes.data?.data || []);
        if (headsRes.ok) setExpenseHeads(headsRes.data?.data || []);
        if (projRes.ok) {
          setAllProjects(projRes.data?.data || []);
        }
        if (secRes.ok) {
          setAllSections(secRes.data?.data || []);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load petty cash data");
    } finally {
      isInitialLoad.current = false;
      setPageLoading(false);
      setContentLoading(false);
    }
  }, [
    selectedProject?.id,
    selectedSection?.id,
    apiFilters,
    isSectionAccountant,
    txDateFrom,
    txDateTo,
  ]);

  const fetchProjectBalance = useCallback(
    async (projectId) => {
      const res = await apiClient.get(
        `/petty-cash/projects/${projectId}/balance`,
        apiFilters
      );
      if (res.ok) setProjectBalance(res.data?.data);
    },
    [apiFilters]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedProject?.id) fetchProjectBalance(selectedProject.id);
  }, [selectedProject, fetchProjectBalance]);

  useEffect(() => {
    if (selectedSection?.id && assignedSections.length > 0) {
      const updated = assignedSections.find((s) => s.id === selectedSection.id);
      if (updated) setSelectedSection(updated);
    }
  }, [assignedSections, selectedSection?.id]);

  const sectionsForProject = useMemo(() => {
    if (!form.projectId) return [];
    if (formSections.length > 0) return formSections;
    return allSections.filter(
      (s) => (s.projectId || s.project?.id) === form.projectId
    );
  }, [form.projectId, formSections, allSections]);

  const selectedSectionAccountant = useMemo(() => {
    if (!form.sectionId) return null;
    return (
      sectionsForProject.find((s) => s.id === form.sectionId)
        ?.sectionAccountant || null
    );
  }, [form.sectionId, sectionsForProject]);

  const openModal = async (type, defaults = {}) => {
    setForm(defaults);
    setFiles([]);
    setFormSections([]);
    setModal(type);
    if (defaults.projectId) {
      await handleProjectSelect(defaults.projectId, false);
    } else if (defaults.sectionId && isSectionAccountant) {
      const sec =
        allSections.find((s) => s.id === defaults.sectionId) ||
        assignedSections.find((s) => s.id === defaults.sectionId);
      if (sec) {
        setForm((prev) => ({
          ...prev,
          sectionId: defaults.sectionId,
          projectId: sec.projectId || sec.project?.id || "",
        }));
      }
    }
  };

  const closeModal = () => {
    setModal(null);
    setForm({});
    setFiles([]);
    setFormSections([]);
    setSectionsLoading(false);
    setHeadForm({ name: "", description: "" });
  };

  const handleSubmitDistributeToProject = async () => {
    if (!form.projectId) return toast.error("Select a project");
    if (!form.amount || Number(form.amount) <= 0)
      return toast.error("Enter a valid amount");
    if (!files.length) return toast.error("Proof is required");

    setSubmitting(true);
    try {
      const proofUrls = await uploadFiles(files, UPLOAD_FOLDERS.proofOfExpense);
      const res = await apiClient.post("/petty-cash/funding", {
        projectId: form.projectId,
        amount: form.amount,
        description: form.description || undefined,
        proofUrls,
      });

      if (res.ok) {
        toast.success("Petty cash distributed to project successfully");
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else {
        toast.error(res.data?.message || "Failed to save");
      }
    } catch {
      toast.error("Error distributing to project");
    } finally {
      setSubmitting(false);
    }
  };

  const getProjectPoolAvailable = useCallback(
    (projectId) => {
      if (!projectId) return 0;
      if (
        selectedProject?.id === projectId &&
        projectBalance?.projectPoolRemaining != null
      ) {
        return clampNonNegative(projectBalance.projectPoolRemaining);
      }
      const project = projects.find((p) => p.id === projectId);
      if (project?.projectPoolRemaining != null) {
        return clampNonNegative(project.projectPoolRemaining);
      }
      return 0;
    },
    [selectedProject?.id, projectBalance?.projectPoolRemaining, projects]
  );

  const handleSubmitInternalExpense = async () => {
    if (!form.projectId) return toast.error("Select a project");
    if (!form.expenseHeadId) return toast.error("Select expense head");
    if (!files.length) return toast.error("Proof is required");

    const availablePool = getProjectPoolAvailable(form.projectId);

    if (
      !validateAmountWithinBalance(
        form.amount,
        availablePool,
        "project balance"
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const proofUrls = await uploadFiles(files, UPLOAD_FOLDERS.proofOfExpense);
      const res = await apiClient.post("/petty-cash/internal-expense", {
        projectId: form.projectId,
        expenseHeadId: form.expenseHeadId,
        amount: form.amount,
        description: form.description || undefined,
        proofUrls,
      });

      if (res.ok) {
        toast.success("Internal expense recorded");
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else {
        toast.error(res.data?.message || "Failed to save");
      }
    } catch {
      toast.error("Error saving internal expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDistribution = async () => {
    if (!form.projectId) return toast.error("Select a project");
    if (!form.sectionId) return toast.error("Select a section");
    if (!files.length) return toast.error("Proof is required");

    const availablePool = getProjectPoolAvailable(form.projectId);

    if (
      !validateAmountWithinBalance(
        form.amount,
        availablePool,
        "project balance"
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const proofUrls = await uploadFiles(files, UPLOAD_FOLDERS.proofOfExpense);
      const res = await apiClient.post("/petty-cash/distribution", {
        projectId: form.projectId,
        sectionId: form.sectionId,
        amount: form.amount,
        description: form.description || undefined,
        proofUrls,
      });
      if (res.ok) {
        toast.success("Distribution recorded");
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else toast.error(res.data?.message || "Failed");
    } catch {
      toast.error("Error distributing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSectionExpense = async () => {
    if (!form.projectId || !form.sectionId)
      return toast.error("Select project and section");
    if (!form.expenseHeadId) return toast.error("Select expense head");
    if (!files.length) return toast.error("Proof is required");

    const availableSectionBalance =
      assignedSections.find((s) => s.id === form.sectionId)?.remaining ??
      (selectedSection?.id === form.sectionId ? selectedSection.remaining : null) ??
      projectBalance?.sections?.find((s) => s.id === form.sectionId)?.remaining ??
      0;

    if (
      !validateAmountWithinBalance(
        form.amount,
        availableSectionBalance,
        "section balance"
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const proofUrls = await uploadFiles(files, UPLOAD_FOLDERS.proofOfExpense);
      const res = await apiClient.post("/petty-cash/section-expense", {
        projectId: form.projectId,
        sectionId: form.sectionId,
        expenseHeadId: form.expenseHeadId,
        amount: form.amount,
        description: form.description || undefined,
        proofUrls,
      });
      if (res.ok) {
        toast.success("Section expense recorded");
        closeModal();
        fetchData();
        if (selectedProject) fetchProjectBalance(selectedProject.id);
      } else toast.error(res.data?.message || "Failed");
    } catch {
      toast.error("Error recording section expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddHead = async () => {
    if (!headForm.name.trim()) return toast.error("Name required");
    setSubmitting(true);
    try {
      const res = await apiClient.post("/petty-cash/expense-heads", headForm);
      if (res.ok) {
        toast.success("Expense head added");
        setHeadForm({ name: "", description: "" });
        const headsRes = await apiClient.get("/petty-cash/expense-heads");
        if (headsRes.ok) setExpenseHeads(headsRes.data?.data || []);
      } else toast.error(res.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHead = async (id) => {
    const res = await apiClient.delete(`/petty-cash/expense-heads/${id}`);
    if (res.ok) {
      toast.success("Deleted");
      const headsRes = await apiClient.get("/petty-cash/expense-heads");
      if (headsRes.ok) setExpenseHeads(headsRes.data?.data || []);
    }
  };

  const tableData = transactions.map((tx) => ({
    id: tx.id,
    createdAt: tx.createdAt,
    date: formatDateDMY(tx.createdAt),
    type: expenseTypeLabels[tx.type] || tx.type,
    typeRaw: tx.type,
    project: tx.project?.name || "-",
    projectId: tx.project?.id || tx.projectId,
    section: tx.section?.name || "-",
    sectionId: tx.section?.id || tx.sectionId,
    head: tx.expenseHead?.name || "-",
    expenseHeadId: tx.expenseHead?.id || "",
    amount: formatCurrency(tx.amount),
    sectionAccountant: getDistributionSectionAccountantName(tx),
    createdBy: tx.creator?.name || "-",
    actorLabel: getPettyCashActorLabel(tx.creator),
    description: tx.description || "-",
    proof: tx.proofUrl,
  }));

  const columns = useMemo(() => {
    const base = [
      { headerName: "Date", field: "date" },
      { headerName: "Type", field: "typeRaw" },
      { headerName: "Project", field: "project" },
      { headerName: "Section", field: "section" },
      { headerName: "Expense Head", field: "head" },
      { headerName: "Amount", field: "amount" },
      { headerName: "Section Accountant", field: "sectionAccountant" },
      { headerName: "By", field: "createdBy" },
      { headerName: "Note", field: "description" },
      { headerName: "Proof", field: "proof" },
    ];
    if (isSectionAccountant) {
      return base.filter((col) => col.field !== "sectionAccountant");
    }
    return base;
  }, [isSectionAccountant]);

  const cellComponents = useMemo(
    () => ({
      typeRaw: (props) => <TypeChip {...props} labels={expenseTypeLabels} />,
      proof: ProofLink,
    }),
    [expenseTypeLabels]
  );

  const txCountByProjectId = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const id = tx.projectId || tx.project?.id;
      if (id) map[id] = (map[id] || 0) + 1;
    });
    return map;
  }, [transactions]);

  const txCountBySectionId = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const id = tx.sectionId || tx.section?.id;
      if (id) map[id] = (map[id] || 0) + 1;
    });
    return map;
  }, [transactions]);

  const filteredProjectsList = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q)
    );
  }, [projects, projectSearch]);

  const filteredSectionsList = useMemo(() => {
    const q = sectionSearch.trim().toLowerCase();
    if (!q) return assignedSections;
    return assignedSections.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.code?.toLowerCase().includes(q) ||
        s.projectName?.toLowerCase().includes(q) ||
        s.projectCode?.toLowerCase().includes(q)
    );
  }, [assignedSections, sectionSearch]);

  const activeTypeFilterScope = useMemo(() => {
    if (!isSectionAccountant && selectedProject && activeTab === 0) {
      if (detailTransactionScope === "project") {
        return isProjectManager ? "pm_project" : "project";
      }
      return "sections";
    }
    if (isSectionAccountant && selectedSection && activeTab === 0) {
      return "sections";
    }
    if (apiFilters.sectionId) return "sections";
    if (apiFilters.projectId) return "all_project";
    return pettyCashRoleKey;
  }, [
    isSectionAccountant,
    selectedProject,
    selectedSection,
    activeTab,
    detailTransactionScope,
    apiFilters.sectionId,
    apiFilters.projectId,
    pettyCashRoleKey,
    isProjectManager,
  ]);

  const typeFilterOptions = useMemo(() => {
    if (activeTypeFilterScope === "project") {
      return mapTypeOptions(PETTY_CASH_TYPES_BY_SCOPE.project, expenseTypeLabels);
    }
    if (activeTypeFilterScope === "pm_project") {
      return mapTypeOptions(
        PETTY_CASH_TYPES_BY_SCOPE.pm_project,
        expenseTypeLabels
      );
    }
    if (activeTypeFilterScope === "sections") {
      return mapTypeOptions(
        PETTY_CASH_TYPES_BY_SCOPE.sections,
        expenseTypeLabels
      );
    }
    if (activeTypeFilterScope === "all_project") {
      return mapTypeOptions(
        PETTY_CASH_TYPES_BY_SCOPE.all_project,
        expenseTypeLabels
      );
    }
    return mapTypeOptions(
      PETTY_CASH_TYPES_BY_ROLE[activeTypeFilterScope] || [],
      expenseTypeLabels
    );
  }, [activeTypeFilterScope, expenseTypeLabels]);

  const filterProjectTransactionsByScope = useCallback(
    (rows, scope) => {
      let filtered = rows;

      if (scope === "project") {
        filtered = filtered.filter((r) =>
          isProjectManager
            ? r.typeRaw === "INTERNAL_EXPENSE"
            : PROJECT_LEVEL_TX_TYPES.has(r.typeRaw)
        );
      } else if (scope === "all_sections") {
        filtered = filtered.filter((r) =>
          SECTION_LEVEL_TX_TYPES.has(r.typeRaw)
        );
      } else {
        const section = projectBalance?.sections?.find((s) => s.id === scope);
        if (section) {
          filtered = filtered.filter((r) => r.sectionId === section.id);
        }
      }

      if (isProjectManager) {
        filtered = filtered.filter((r) => r.typeRaw !== "FUNDING");
      }

      return filtered;
    },
    [projectBalance, isProjectManager]
  );

  const projectDetailSubtitle = useMemo(() => {
    if (detailTransactionScope === "project") {
      return isProjectManager
        ? "Project-level transactions (internal expenses only)"
        : "Project-level transactions (funding & project internal expenses)";
    }
    if (detailTransactionScope === "all_sections") {
      return "All section transactions in this project";
    }
    const section = projectBalance?.sections?.find(
      (s) => s.id === detailTransactionScope
    );
    return section
      ? `${section.name} transactions`
      : "Filtered section transactions";
  }, [detailTransactionScope, projectBalance]);

  const roleFilterOptions = useMemo(
    () =>
      PETTY_CASH_ACTORS_BY_ROLE[pettyCashRoleKey].map((value) => ({
        value,
        label: value,
      })),
    [pettyCashRoleKey]
  );

  const expenseHeadFilterOptions = useMemo(() => {
    const names = new Set(
      expenseHeads.map((h) => h.name).filter(Boolean)
    );
    tableData.forEach((row) => {
      if (row.head && row.head !== "-") names.add(row.head);
    });
    return [...names]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ value: name, label: name }));
  }, [expenseHeads, tableData]);

  useEffect(() => {
    if (
      txTypeFilter !== "all" &&
      !typeFilterOptions.some((option) => option.value === txTypeFilter)
    ) {
      setTxTypeFilter("all");
    }
  }, [typeFilterOptions, txTypeFilter]);

  useEffect(() => {
    if (
      txByFilter !== "all" &&
      !roleFilterOptions.some((option) => option.value === txByFilter)
    ) {
      setTxByFilter("all");
    }
  }, [roleFilterOptions, txByFilter]);

  useEffect(() => {
    if (
      txHeadFilter !== "all" &&
      !expenseHeadFilterOptions.some((option) => option.value === txHeadFilter)
    ) {
      setTxHeadFilter("all");
    }
  }, [expenseHeadFilterOptions, txHeadFilter]);

  const filterTransactions = useCallback(
    (rows) => {
      const q = txSearch.trim().toLowerCase();
      return rows.filter((row) => {
        const matchesType =
          txTypeFilter === "all" || row.typeRaw === txTypeFilter;
        const matchesBy =
          txByFilter === "all" || row.actorLabel === txByFilter;
        const matchesHead =
          txHeadFilter === "all" || row.head === txHeadFilter;
        const matchesDate = isTransactionInDateRange(
          row.createdAt,
          txDateFrom,
          txDateTo
        );
        if (!matchesType || !matchesBy || !matchesHead || !matchesDate) {
          return false;
        }
        if (!q) return true;
        return [
          row.date,
          row.type,
          row.project,
          row.section,
          row.head,
          row.amount,
          row.sectionAccountant,
          row.createdBy,
          row.actorLabel,
          row.description,
        ].some((v) => String(v || "").toLowerCase().includes(q));
      });
    },
    [txSearch, txTypeFilter, txByFilter, txHeadFilter, txDateFrom, txDateTo]
  );

  const selectedProjectTransactions = useMemo(() => {
    if (!selectedProject) return [];
    let rows = tableData.filter((r) => r.projectId === selectedProject.id);
    rows = filterProjectTransactionsByScope(rows, detailTransactionScope);
    return filterTransactions(rows);
  }, [
    tableData,
    selectedProject,
    detailTransactionScope,
    filterProjectTransactionsByScope,
    filterTransactions,
  ]);

  const selectedSectionTransactions = useMemo(() => {
    if (!selectedSection) return [];
    const rows = tableData.filter((r) => r.sectionId === selectedSection.id);
    return filterTransactions(rows);
  }, [tableData, selectedSection, filterTransactions]);

  const filteredAllTransactions = useMemo(
    () => filterTransactions(tableData),
    [tableData, filterTransactions]
  );

  const applyTableFilters = useCallback(
    (rows) => {
      let next = rows;
      if (txTypeFilter !== "all") {
        next = next.filter((r) => r.typeRaw === txTypeFilter);
      }
      if (txByFilter !== "all") {
        next = next.filter((r) => r.actorLabel === txByFilter);
      }
      if (txHeadFilter !== "all") {
        next = next.filter((r) => r.head === txHeadFilter);
      }
      if (txDateFrom || txDateTo) {
        next = next.filter((r) =>
          isTransactionInDateRange(r.createdAt, txDateFrom, txDateTo)
        );
      }
      return next;
    },
    [txTypeFilter, txByFilter, txHeadFilter, txDateFrom, txDateTo]
  );

  const sectionExportData = useMemo(() => {
    if (!selectedSection) return [];
    const rows = tableData.filter((r) => r.sectionId === selectedSection.id);
    return applyTableFilters(rows);
  }, [tableData, selectedSection, applyTableFilters]);

  const projectExportData = useMemo(() => {
    if (!selectedProject) return [];
    let rows = tableData.filter((r) => r.projectId === selectedProject.id);
    rows = filterProjectTransactionsByScope(rows, detailTransactionScope);
    return applyTableFilters(rows);
  }, [
    tableData,
    selectedProject,
    detailTransactionScope,
    filterProjectTransactionsByScope,
    applyTableFilters,
  ]);

  const allTxExportData = useMemo(
    () => applyTableFilters(tableData),
    [tableData, applyTableFilters]
  );

  const resetTransactionControls = useCallback(() => {
    setTxSearch("");
    setTxTypeFilter("all");
    setTxByFilter("all");
    setTxHeadFilter("all");
    setTxDateFrom("");
    setTxDateTo("");
  }, []);

  const handleTxDateFromChange = useCallback(
    (value) => {
      if (txDateTo && value && value > txDateTo) {
        toast.error("Start date cannot be after end date");
        return;
      }
      setTxDateFrom(value);
    },
    [txDateTo]
  );

  const handleTxDateToChange = useCallback(
    (value) => {
      if (txDateFrom && value && value < txDateFrom) {
        toast.error("End date cannot be before start date");
        return;
      }
      setTxDateTo(value);
    },
    [txDateFrom]
  );

  const clearTxDateRange = useCallback(() => {
    setTxDateFrom("");
    setTxDateTo("");
  }, []);

  const pettyCashTabs = useMemo(() => {
    if (isSectionAccountant) {
      return [
        {
          id: 0,
          label: "My Sections",
          icon: <Layers sx={{ fontSize: 18 }} />,
          badge: assignedSections.length,
        },
        {
          id: 1,
          label: "All Transactions",
          icon: <ReceiptLong sx={{ fontSize: 18 }} />,
          badge: transactions.length,
        },
      ];
    }
    return [
      {
        id: 0,
        label: "By Project",
        icon: <FolderOpen sx={{ fontSize: 18 }} />,
        badge: projects.length,
      },
      {
        id: 1,
        label: "All Transactions",
        icon: <ReceiptLong sx={{ fontSize: 18 }} />,
        badge: transactions.length,
      },
    ];
  }, [
    isSectionAccountant,
    assignedSections.length,
    projects.length,
    transactions.length,
  ]);

  const goBackToProjects = () => {
    setSelectedProject(null);
    setProjectBalance(null);
    setDetailTransactionScope("all_sections");
    resetTransactionControls();
  };

  const goBackToSections = () => {
    setSelectedSection(null);
    resetTransactionControls();
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setDetailTransactionScope("all_sections");
    resetTransactionControls();
  };

  const handleSelectSection = (section) => {
    setSelectedSection(section);
    resetTransactionControls();
  };

  const sectionOptions = useMemo(
    () => [...new Set(allSections.map((s) => s.name).filter(Boolean))],
    [allSections]
  );

  const projectOptions = useMemo(
    () => [...new Set(allProjects.map((p) => p.name).filter(Boolean))],
    [allProjects]
  );

  const filterConfig = isSectionAccountant
    ? [{ label: "Section", options: sectionOptions }]
    : [
        { label: "Project", options: projectOptions },
        { label: "Section", options: sectionOptions },
      ];

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
    if (isSectionAccountant) {
      goBackToSections();
      setSectionSearch("");
    } else {
      goBackToProjects();
      setProjectSearch("");
    }
    const next = {};
    if (!isSectionAccountant && newSelected.Project?.length) {
      const proj = allProjects.find((p) => p.name === newSelected.Project[0]);
      if (proj) next.projectId = proj.id;
    }
    if (newSelected.Section?.length) {
      const sec = allSections.find((s) => s.name === newSelected.Section[0]);
      if (sec) next.sectionId = sec.id;
    }
    setApiFilters(next);
  };

  const handleFilterClear = () => {
    setFilter({ Project: [], Section: [] });
    setApiFilters({});
    if (isSectionAccountant) {
      goBackToSections();
      setSectionSearch("");
    } else {
      goBackToProjects();
      setProjectSearch("");
    }
  };

  const actionButtons = useMemo(() => {
    const items = [];
    if (permissions.canAddFunding) {
      items.push({
        key: "distributeProject",
        label: "Distribute to Project",
        styleKey: "distributeProject",
        onClick: () =>
          openModal("distributeProject", { projectId: selectedProject?.id }),
      });
    }
    if (permissions.canDistribute) {
      items.push({
        key: "distribution",
        label: "Distribute To Section",
        styleKey: "distributeSection",
        onClick: () =>
          openModal("distribution", { projectId: selectedProject?.id }),
      });
    }
    if (permissions.canAddInternalExpense) {
      items.push({
        key: "internalExpense",
        label: usesDetailedExpenseNames
          ? "Project Internal Expense"
          : "Internal Expense",
        styleKey: "internalExpense",
        onClick: () =>
          openModal("internalExpense", { projectId: selectedProject?.id }),
      });
    }
    if (permissions.canAddSectionExpense) {
      items.push({
        key: "sectionExpense",
        label: usesDetailedExpenseNames
          ? "Section Internal Expense"
          : "Section Expense",
        styleKey: "sectionExpense",
        onClick: () =>
          openModal("sectionExpense", {
            projectId: isSectionAccountant
              ? selectedSection?.projectId
              : selectedProject?.id,
            sectionId: isSectionAccountant ? selectedSection?.id : undefined,
          }),
      });
    }
    if (permissions.canManageHeads) {
      items.push({
        key: "heads",
        label: "Manage Expense Heads",
        styleKey: "manageHeads",
        onClick: () => openModal("heads"),
      });
    }
    return items;
  }, [
    permissions,
    selectedProject?.id,
    selectedSection,
    isSectionAccountant,
    usesDetailedExpenseNames,
  ]);

  const overviewCards = [
    {
      icon: Payments,
      label: "Credited",
      count: formatCurrency(summary?.totalCredited),
      countColor: "#8b5cf6",
    },
    {
      icon: TrendingDown,
      label: "Debited",
      count: formatCurrency(summary?.totalDebited),
      countColor: "#ef4444",
    },
    {
      icon: AccountBalance,
      label:
        summary?.roleScope === "HEAD_OFFICE_ACCOUNTANT"
          ? "Remaining Balance In All Projects"
          : "Remaining Balance",
      count: formatCurrency(summary?.remainingBalance),
      countColor: "#22c55e",
    },
  ];

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader text={LOADING_TEXT} />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-6 relative">
      <TopBar title="Petty Cash" />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />

      <div className="flex flex-row flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">
          Overview
        </h2>
        <div className="flex flex-row flex-wrap items-center justify-end gap-3">
          {!isReadOnly &&
            actionButtons.map((btn) => (
              <PettyCashActionButton
                key={btn.key}
                label={btn.label}
                styleKey={btn.styleKey}
                onClick={btn.onClick}
                disabled={contentLoading}
              />
            ))}
          <CustomFilterDropdown
            filters={filterConfig}
            selected={filter}
            onChange={handleFilterChange}
            onClear={handleFilterClear}
            placeholder={
              isSectionAccountant
                ? "Filter by section"
                : "Filter by project or section"
            }
            dropdownAlign="right"
          />
        </div>
      </div>

      {fullPageOverlayOnFilter && (
        <ContentLoadingOverlay show={contentLoading} fullPage />
      )}

      <div
        className={`relative ${contentLoading ? "pointer-events-none select-none" : ""}`}
      >
        <div
          className={`border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 transition-opacity duration-200 ${
            contentLoading && !fullPageOverlayOnFilter ? "opacity-40" : ""
          }`}
        >
          {overviewCards.map((item) => (
            <div
              key={item.label}
              className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 xl:last:after:hidden"
            >
              <AnalyticsCard
                icon={item.icon}
                label={item.label}
                count={item.count}
                countColor={item.countColor}
              />
            </div>
          ))}
        </div>

        {!fullPageOverlayOnFilter && (
          <ContentLoadingOverlay show={contentLoading} />
        )}

        <div
          className={`mt-6 transition-opacity duration-200 ${
            contentLoading && !fullPageOverlayOnFilter ? "opacity-40" : ""
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-primary">
                {isSectionAccountant
                  ? "Sections & Transactions"
                  : "Projects & Transactions"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isSectionAccountant
                  ? "View petty cash received, spent, and remaining for your assigned sections"
                  : "Browse by project or view all petty cash activity in one place"}
              </p>
            </div>
            <PillTabs
              tabs={pettyCashTabs}
              active={activeTab}
              onChange={(tabId) => {
                setActiveTab(tabId);
                resetTransactionControls();
              }}
            />
          </div>

          {isSectionAccountant && activeTab === 0 && !selectedSection && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800">Your sections</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {filteredSectionsList.length} of {assignedSections.length}{" "}
                      shown — click to view section activity
                    </p>
                  </div>
                  <SearchField
                    value={sectionSearch}
                    onChange={setSectionSearch}
                    placeholder="Search by section, project, or code..."
                  />
                </div>
              </div>

              {filteredSectionsList.length === 0 ? (
                <EmptyState
                  icon={Layers}
                  title={
                    assignedSections.length === 0
                      ? "No assigned sections"
                      : "No matching sections"
                  }
                  description={
                    assignedSections.length === 0
                      ? "Petty cash distributions to your section will appear here once recorded."
                      : "Try a different search term or clear your filters above."
                  }
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredSectionsList.map((s, index) => (
                    <SectionListCard
                      key={s.id}
                      section={s}
                      index={index}
                      onSelect={handleSelectSection}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {isSectionAccountant && activeTab === 0 && selectedSection && (
            <div className="space-y-5">
              <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
                <button
                  type="button"
                  onClick={goBackToSections}
                  className="hover:text-[#FC8908] font-medium transition-colors"
                >
                  Sections
                </button>
                <FiChevronRight className="text-gray-400 shrink-0" />
                <span className="text-gray-800 font-semibold truncate">
                  {selectedSection.name}
                </span>
              </nav>

              <button
                type="button"
                onClick={goBackToSections}
                className="inline-flex items-center gap-1.5 text-[#FC8908] hover:text-[#e07c07] text-sm font-semibold transition-colors"
              >
                <FiChevronLeft /> Back to all sections
              </button>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedSection.name}
                  </h2>
                  {selectedSection.code && (
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                      {selectedSection.code}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {selectedSection.projectName}
                  {selectedSection.projectCode
                    ? ` · ${selectedSection.projectCode}`
                    : ""}
                </p>
              </div>

              <TablePanel
                title="Section transactions"
                subtitle={`All petty cash activity for ${selectedSection.name}`}
                count={selectedSectionTransactions.length}
                search={
                  <>
                    <TableFilterSelect
                      allLabel="Type: All"
                      options={typeFilterOptions}
                      value={txTypeFilter}
                      onChange={setTxTypeFilter}
                    />
                    <TableFilterSelect
                      allLabel="By: All actors"
                      options={roleFilterOptions}
                      value={txByFilter}
                      onChange={setTxByFilter}
                    />
                    <TableFilterSelect
                      allLabel="Expense Head: All"
                      options={expenseHeadFilterOptions}
                      value={txHeadFilter}
                      onChange={setTxHeadFilter}
                    />
                    <TableDateRangeFilter
                      from={txDateFrom}
                      to={txDateTo}
                      onFromChange={handleTxDateFromChange}
                      onToChange={handleTxDateToChange}
                      onClear={clearTxDateRange}
                    />
                    <SearchField
                      value={txSearch}
                      onChange={setTxSearch}
                      placeholder="Search transactions..."
                    />
                    <ExportToExcelButton
                      data={sectionExportData}
                      columns={columns}
                      fileName="petty-cash-section-transactions"
                      cellComponents={cellComponents}
                    />
                  </>
                }
              >
                {selectedSectionTransactions.length === 0 ? (
                  <EmptyState
                    icon={ReceiptLong}
                    title="No transactions found"
                    description="No petty cash activity matches your current search."
                  />
                ) : (
                  <SimpleTable
                    data={selectedSectionTransactions}
                    columns={columns}
                    cellComponents={cellComponents}
                    exportable={false}
                  />
                )}
              </TablePanel>
            </div>
          )}

          {!isSectionAccountant && activeTab === 0 && !selectedProject && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800">Your projects</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {filteredProjectsList.length} of {projects.length} shown
                      — click to drill into balances & transactions
                    </p>
                  </div>
                  <SearchField
                    value={projectSearch}
                    onChange={setProjectSearch}
                    placeholder="Search by name or code..."
                  />
                </div>
              </div>

              {filteredProjectsList.length === 0 ? (
                <EmptyState
                  icon={FolderOpen}
                  title={
                    projects.length === 0
                      ? "No projects yet"
                      : "No matching projects"
                  }
                  description={
                    projects.length === 0
                      ? "Distribute petty cash to a project to start tracking expenses."
                      : "Try a different search term or clear your filters above."
                  }
                  action={
                    projects.length === 0 &&
                    !isReadOnly &&
                    permissions.canAddFunding ? (
                      <PettyCashActionButton
                        label="Distribute to Project"
                        styleKey="distributeProject"
                        onClick={() => openModal("distributeProject")}
                      />
                    ) : null
                  }
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredProjectsList.map((p, index) => (
                    <ProjectListCard
                      key={p.id}
                      project={p}
                      index={index}
                      txCount={txCountByProjectId[p.id] || 0}
                      onSelect={handleSelectProject}
                      sectionScopedView={usesSectionScopedMetrics}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {!isSectionAccountant && activeTab === 0 && selectedProject && (
            <div className="space-y-5">
              <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
                <button
                  type="button"
                  onClick={goBackToProjects}
                  className="hover:text-[#FC8908] font-medium transition-colors"
                >
                  Projects
                </button>
                <FiChevronRight className="text-gray-400 shrink-0" />
                <span className="text-gray-800 font-semibold truncate">
                  {selectedProject.name}
                </span>
              </nav>

              <button
                type="button"
                onClick={goBackToProjects}
                className="inline-flex items-center gap-1.5 text-[#FC8908] hover:text-[#e07c07] text-sm font-semibold transition-colors"
              >
                <FiChevronLeft /> Back to all projects
              </button>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedProject.name}
                  </h2>
                  {selectedProject.code && (
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                      {selectedProject.code}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Project-level petty cash summary and transaction history
                </p>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="font-bold text-gray-800">
                    Transaction scope
                  </h3>
                  <p className="text-xs text-gray-500">
                    Filter project balance activity or section-level transactions
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setDetailTransactionScope("project")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      detailTransactionScope === "project"
                        ? "bg-[#0252AD] text-white border-[#0252AD]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#0252AD]"
                    }`}
                  >
                    Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailTransactionScope("all_sections")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      detailTransactionScope === "all_sections"
                        ? "bg-[#FC8908] text-white border-[#FC8908]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#FC8908]"
                    }`}
                  >
                    All sections
                  </button>
                </div>
              </div>

              {projectBalance?.sections?.length > 0 && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-gray-800">Section balances</h3>
                    <p className="text-xs text-gray-500">
                      Click a section to filter section transactions below
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {projectBalance.sections.map((s, index) => (
                      <SectionBalanceCard
                        key={s.id}
                        section={s}
                        accent={getProjectAccent(index)}
                        active={detailTransactionScope === s.id}
                        onSelect={(id) =>
                          setDetailTransactionScope((prev) =>
                            prev === id ? "all_sections" : id
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              <TablePanel
                title="Project transactions"
                subtitle={projectDetailSubtitle}
                count={selectedProjectTransactions.length}
                search={
                  <>
                    <TableFilterSelect
                      allLabel="Type: All"
                      options={typeFilterOptions}
                      value={txTypeFilter}
                      onChange={setTxTypeFilter}
                    />
                    <TableFilterSelect
                      allLabel="By: All actors"
                      options={roleFilterOptions}
                      value={txByFilter}
                      onChange={setTxByFilter}
                    />
                    <TableFilterSelect
                      allLabel="Expense Head: All"
                      options={expenseHeadFilterOptions}
                      value={txHeadFilter}
                      onChange={setTxHeadFilter}
                    />
                    <TableDateRangeFilter
                      from={txDateFrom}
                      to={txDateTo}
                      onFromChange={handleTxDateFromChange}
                      onToChange={handleTxDateToChange}
                      onClear={clearTxDateRange}
                    />
                    <SearchField
                      value={txSearch}
                      onChange={setTxSearch}
                      placeholder="Search transactions..."
                    />
                    <ExportToExcelButton
                      data={projectExportData}
                      columns={columns}
                      fileName="petty-cash-project-transactions"
                      cellComponents={cellComponents}
                    />
                  </>
                }
              >
                {selectedProjectTransactions.length === 0 ? (
                  <EmptyState
                    icon={ReceiptLong}
                    title="No transactions found"
                    description="No petty cash activity matches your current scope filter or search."
                  />
                ) : (
                  <SimpleTable
                    data={selectedProjectTransactions}
                    columns={columns}
                    cellComponents={cellComponents}
                    exportable={false}
                  />
                )}
              </TablePanel>
            </div>
          )}

          {activeTab === 1 && (
            <TablePanel
              title="All transactions"
              subtitle={
                isSectionAccountant
                  ? "Complete petty cash ledger for your assigned sections"
                  : "Complete petty cash ledger across projects"
              }
              count={filteredAllTransactions.length}
              search={
                <>
                  <TableFilterSelect
                    allLabel="Type: All"
                    options={typeFilterOptions}
                    value={txTypeFilter}
                    onChange={setTxTypeFilter}
                  />
                  <TableFilterSelect
                    allLabel="By: All actors"
                    options={roleFilterOptions}
                    value={txByFilter}
                    onChange={setTxByFilter}
                  />
                  <TableFilterSelect
                    allLabel="Expense Head: All"
                    options={expenseHeadFilterOptions}
                    value={txHeadFilter}
                    onChange={setTxHeadFilter}
                  />
                  <TableDateRangeFilter
                    from={txDateFrom}
                    to={txDateTo}
                    onFromChange={handleTxDateFromChange}
                    onToChange={handleTxDateToChange}
                    onClear={clearTxDateRange}
                  />
                  <SearchField
                    value={txSearch}
                    onChange={setTxSearch}
                    placeholder="Search transactions..."
                  />
                  <ExportToExcelButton
                    data={allTxExportData}
                    columns={columns}
                    fileName="petty-cash-all-transactions"
                    cellComponents={cellComponents}
                  />
                </>
              }
            >
              {filteredAllTransactions.length === 0 ? (
                <EmptyState
                  icon={ReceiptLong}
                  title="No transactions found"
                  description={
                    tableData.length === 0
                      ? "Transactions will appear here once petty cash activity is recorded."
                      : "No records match your search. Try different keywords or clear filters."
                  }
                />
              ) : (
                <SimpleTable
                  data={filteredAllTransactions}
                  columns={columns}
                  cellComponents={cellComponents}
                  exportable={false}
                />
              )}
            </TablePanel>
          )}
        </div>
      </div>

      {/* Distribute to Project Modal */}
      <Modal open={modal === "distributeProject"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Distribute to Project</h2>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Project *</label>
            <select
              className="border rounded-lg p-2.5 w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.projectId || ""}
              onChange={(e) =>
                setForm({ ...form, projectId: e.target.value })
              }
            >
              <option value="">Select project</option>
              {projectOptionsForModal.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <CustomTextField
              label="Amount *"
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <CustomTextField
              label="Note"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <FileUploadField
              label="Proof"
              required
              files={files}
              onChange={setFiles}
              disabled={submitting || fileUploading}
            />
            <p className="text-xs text-gray-400">Date is recorded automatically.</p>
            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-800"
                disabled={submitting}
              />
              <Button
                buttonText={submitting ? "Saving..." : "Distribute"}
                onClick={handleSubmitDistributeToProject}
                className="flex-1"
                disabled={submitting}
              />
            </div>
            {submitting && (
              <div className="flex justify-center">
                <Loader size="small" showText={false} />
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {/* Distribution Modal */}
      <Modal open={modal === "distribution"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Distribute To Section</h2>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Project *</label>
            <select
              className="border rounded p-2"
              value={form.projectId || ""}
              onChange={(e) => handleProjectSelect(e.target.value)}
            >
              <option value="">Select project</option>
              {projectOptionsForModal.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <label className="text-sm font-medium">Section *</label>
            <SectionSelectField
              projectId={form.projectId}
              sectionId={form.sectionId}
              sectionsLoading={sectionsLoading}
              sections={sectionsForProject}
              onChange={(e) =>
                setForm({
                  ...form,
                  sectionId: e.target.value,
                })
              }
            />
            {form.projectId && !sectionsLoading && sectionsForProject.length === 0 && (
              <p className="text-xs text-amber-600">
                No sections found for this project.
              </p>
            )}

            {form.sectionId && (
              <div
                className={`rounded-lg border px-3 py-2.5 text-sm ${
                  selectedSectionAccountant
                    ? "border-blue-100 bg-blue-50 text-blue-900"
                    : "border-amber-200 bg-amber-50 text-amber-900"
                }`}
              >
                {selectedSectionAccountant ? (
                  <>
                    <p className="font-medium">Section accountant</p>
                    <p className="mt-0.5">
                      {selectedSectionAccountant.name}
                      {selectedSectionAccountant.email
                        ? ` (${selectedSectionAccountant.email})`
                        : ""}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      This amount will be allocated to the selected section and
                      held by the responsible section accountant.
                    </p>
                  </>
                ) : (
                  <p>
                    No section accountant is assigned to this section. Assign a
                    section accountant before distributing petty cash.
                  </p>
                )}
              </div>
            )}

            {form.projectId && (
              <p className="text-xs text-gray-600">
                Available project balance:{" "}
                <span className="font-semibold text-[#22c55e]">
                  {formatCurrency(getProjectPoolAvailable(form.projectId))}
                </span>
              </p>
            )}

            <CustomTextField
              label="Amount *"
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <CustomTextField
              label="Note"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <FileUploadField
              label="Proof"
              required
              files={files}
              onChange={setFiles}
              disabled={submitting || fileUploading}
            />
            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-800"
                disabled={submitting}
              />
              <Button
                buttonText={submitting ? "Saving..." : "Distribute"}
                onClick={handleSubmitDistribution}
                className="flex-1"
                disabled={
                  submitting ||
                  sectionsLoading ||
                  (form.sectionId && !selectedSectionAccountant)
                }
              />
            </div>
            {submitting && (
              <div className="flex justify-center">
                <Loader size="small" showText={false} />
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {/* Internal Expense Modal */}
      <Modal open={modal === "internalExpense"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">
            {usesDetailedExpenseNames
              ? "Project Internal Expense"
              : "Internal Expense"}
          </h2>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Project *</label>
            <select
              className="border rounded p-2"
              value={form.projectId || ""}
              onChange={(e) => handleProjectSelect(e.target.value)}
            >
              <option value="">Select project</option>
              {projectOptionsForModal.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <label className="text-sm font-medium">Expense Head *</label>
            <select
              className="border rounded p-2"
              value={form.expenseHeadId || ""}
              onChange={(e) =>
                setForm({ ...form, expenseHeadId: e.target.value })
              }
            >
              <option value="">Select expense head</option>
              {expenseHeads.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
            {expenseHeads.length === 0 && (
              <p className="text-xs text-amber-600">
                No expense heads available. Contact an administrator to add expense heads.
              </p>
            )}

            {form.projectId && (
              <p className="text-xs text-gray-600">
                Available project balance:{" "}
                <span className="font-semibold text-[#22c55e]">
                  {formatCurrency(getProjectPoolAvailable(form.projectId))}
                </span>
              </p>
            )}

            <CustomTextField
              label="Amount *"
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <CustomTextField
              label="Note"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <FileUploadField
              label="Proof"
              required
              files={files}
              onChange={setFiles}
              disabled={submitting || fileUploading}
            />
            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-800"
                disabled={submitting}
              />
              <Button
                buttonText={submitting ? "Saving..." : "Record Expense"}
                onClick={handleSubmitInternalExpense}
                className="flex-1"
                disabled={submitting}
              />
            </div>
            {submitting && (
              <div className="flex justify-center">
                <Loader size="small" showText={false} />
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {/* Section Expense Modal */}
      <Modal open={modal === "sectionExpense"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">
            {usesDetailedExpenseNames
              ? "Section Internal Expense"
              : "Section Expense"}
          </h2>
          <div className="flex flex-col gap-4">
            {isSectionAccountant ? (
              <>
                <label className="text-sm font-medium">Section *</label>
                <select
                  className="border rounded p-2"
                  value={form.sectionId || ""}
                  onChange={(e) => {
                    const sec = allSections.find((s) => s.id === e.target.value);
                    setForm({
                      ...form,
                      sectionId: e.target.value,
                      projectId:
                        sec?.projectId || sec?.project?.id || form.projectId,
                    });
                  }}
                >
                  <option value="">Select section</option>
                  {allSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.code ? ` (${s.code})` : ""}
                      {s.project?.name ? ` — ${s.project.name}` : ""}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label className="text-sm font-medium">Project *</label>
                <select
                  className="border rounded p-2"
                  value={form.projectId || ""}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                >
                  <option value="">Select project</option>
                  {projectOptionsForModal.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <label className="text-sm font-medium">Section *</label>
                <SectionSelectField
                  projectId={form.projectId}
                  sectionId={form.sectionId}
                  sectionsLoading={sectionsLoading}
                  sections={sectionsForProject}
                  onChange={(e) =>
                    setForm({ ...form, sectionId: e.target.value })
                  }
                />
              </>
            )}

            <label className="text-sm font-medium">Expense Head *</label>
            <select
              className="border rounded p-2"
              value={form.expenseHeadId || ""}
              onChange={(e) =>
                setForm({ ...form, expenseHeadId: e.target.value })
              }
            >
              <option value="">Select head</option>
              {expenseHeads.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
            <CustomTextField
              label="Amount *"
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <CustomTextField
              label="Note"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <FileUploadField
              label="Proof"
              required
              files={files}
              onChange={setFiles}
              disabled={submitting || fileUploading}
            />
            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-800"
                disabled={submitting}
              />
              <Button
                buttonText={submitting ? "Saving..." : "Record"}
                onClick={handleSubmitSectionExpense}
                className="flex-1"
                disabled={submitting || sectionsLoading}
              />
            </div>
            {submitting && (
              <div className="flex justify-center">
                <Loader size="small" showText={false} />
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {/* Expense Heads Modal */}
      <Modal open={modal === "heads"} onClose={closeModal}>
        <Box sx={modalStyle} className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">Expense Heads</h2>
          {permissions.canManageHeads && (
            <div className="flex flex-col gap-3 mb-4 border-b pb-4">
              <CustomTextField
                label="Name *"
                value={headForm.name}
                onChange={(e) =>
                  setHeadForm({ ...headForm, name: e.target.value })
                }
              />
              <CustomTextField
                label="Description"
                value={headForm.description}
                onChange={(e) =>
                  setHeadForm({ ...headForm, description: e.target.value })
                }
              />
              <Button
                buttonText="Add Head"
                onClick={handleAddHead}
                disabled={submitting}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {expenseHeads.map((h) => (
              <div
                key={h.id}
                className="flex justify-between items-center border rounded p-2"
              >
                <div>
                  <p className="font-medium">{h.name}</p>
                  {h.description && (
                    <p className="text-xs text-gray-500">{h.description}</p>
                  )}
                </div>
                {permissions.canManageHeads && (
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => handleDeleteHead(h.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            {expenseHeads.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No expense heads yet. Add Utility Bills, Lunch, Groceries, etc.
              </p>
            )}
          </div>
          <Button
            buttonText="Close"
            onClick={closeModal}
            className="mt-4 w-full bg-gray-200 text-gray-800"
          />
        </Box>
      </Modal>
    </div>
  );
};

export default PettyCashModule;
