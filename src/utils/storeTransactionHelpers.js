const LS_KEY = "viewed_store_transactions";
const ACCEPTED_LS_KEY = "accepted_store_transactions";
const ACCEPTED_TRANSACTION_DATA_KEY = "accepted_store_transaction_data";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const STATIC_REFS = new Set(["INITIAL", "MANUAL", "TRANSFER", "LOSS", "DEMAND"]);

export const getViewedMap = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

export const markTransactionViewed = (transactionId) => {
  const map = getViewedMap();
  map[transactionId] = Date.now();
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch {}
};

export const buildViewedSet = () => {
  const map = getViewedMap();
  const now = Date.now();
  const set = new Set();
  for (const [id, ts] of Object.entries(map)) {
    if (now - ts < TWENTY_FOUR_HOURS) set.add(id);
  }
  return set;
};

export const getAcceptedMap = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCEPTED_LS_KEY) || "{}");
  } catch {
    return {};
  }
};

export const setAcceptedMap = (data) => {
  try {
    localStorage.setItem(ACCEPTED_LS_KEY, JSON.stringify(data));
  } catch {}
};

export const getAcceptedTransactionData = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCEPTED_TRANSACTION_DATA_KEY) || "{}");
  } catch {
    return {};
  }
};

export const setAcceptedTransactionData = (data) => {
  try {
    localStorage.setItem(ACCEPTED_TRANSACTION_DATA_KEY, JSON.stringify(data));
  } catch {}
};

export const markTransactionAccepted = (transactionId) => {
  const map = getAcceptedMap();
  map[transactionId] = Date.now();
  setAcceptedMap(map);
};

export const buildAcceptedSet = () => new Set(Object.keys(getAcceptedMap()));

export const buildAcceptedData = () => getAcceptedTransactionData();

export const isTransactionNew = (transaction, viewedSet) => {
  if (!transaction?.transactionDate) return false;
  const isRecent =
    new Date(transaction.transactionDate) >
    new Date(Date.now() - TWENTY_FOUR_HOURS);
  return isRecent && !viewedSet.has(transaction.id);
};

export const formatStoreDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getStoreFlowLabel = (store) => {
  if (!store) return null;
  if (store.type === "HEAD_STORE") return "Head Store";
  return store.name || "—";
};

const getCurrentStoreFlowLabel = (store) => {
  if (!store) return "—";
  if (store.type === "HEAD_STORE") return "Head Store";
  return store.name || "—";
};

export const isPoStockIn = (transaction) =>
  transaction?.type === "IN" &&
  !transaction?.fromStoreId &&
  !!transaction?.reference &&
  !STATIC_REFS.has((transaction.reference || "").toUpperCase());

export const formatTransactionReference = (transaction) => {
  const ref = (transaction?.reference || "").toUpperCase();
  if (ref === "INITIAL") return "INITIAL";
  if (ref === "TRANSFER") return "TRANSFER";
  if (ref === "MANUAL") return "MANUAL";
  if (ref === "LOSS") return "LOSS";
  if (isPoStockIn(transaction)) return "PO";
  return transaction?.reference || "—";
};

export const formatTransactionFlow = (transaction, currentStore) => {
  const ref = (transaction?.reference || "").toUpperCase();

  if (ref === "MANUAL" && transaction?.type === "OUT") {
    return "MANUALLY USED";
  }

  const currentLabel = getCurrentStoreFlowLabel(currentStore);

  if (transaction?.type === "OUT") {
    const toLabel = getStoreFlowLabel(transaction.toStore);
    if (toLabel) return `FROM ${currentLabel} TO ${toLabel}`;
    if (ref === "LOSS") return "RECORDED AS LOSS";
    return transaction.reference || transaction.notes || "—";
  }

  if (transaction?.type === "IN") {
    const fromLabel = getStoreFlowLabel(transaction.fromStore);
    if (fromLabel) return `FROM ${fromLabel} TO ${currentLabel}`;
    if (ref === "INITIAL") return "INITIALLY ADDED";
    if (isPoStockIn(transaction)) return `FROM PO ${transaction.reference}`;
    return transaction.reference || transaction.notes || "—";
  }

  return "—";
};

export const isIncomingTransfer = (transaction) =>
  transaction?.type === "IN" && !!transaction?.fromStoreId;

export const isTransferAcceptedOnServer = (transaction) =>
  !!transaction?.acceptedAt ||
  (transaction?.notes || "").includes("Received:");

export const isTransferAccepted = (transaction, acceptedSet = new Set()) =>
  acceptedSet.has(transaction?.id) || isTransferAcceptedOnServer(transaction);

export const extractReceivingNotes = (notes) => {
  if (!notes) return "";
  const pipeMatch = notes.match(/\| Received: (.+)$/);
  if (pipeMatch) return pipeMatch[1].trim();
  if (notes.startsWith("Received:")) {
    return notes.replace(/^Received:\s*/, "").trim();
  }
  return "";
};

export const buildReceivingDocuments = (transaction, acceptedData = {}) => {
  if (acceptedData.documentUrls?.length) return acceptedData.documentUrls;
  if (isTransferAcceptedOnServer(transaction) && transaction?.documentUrl) {
    return [{ url: transaction.documentUrl, label: "Receiving Document" }];
  }
  return [];
};

export const buildTransactionRow = (
  item,
  currentStore,
  {
    inventory = [],
    acceptedTransactions = {},
    acceptedSet = new Set(),
    viewedSet = new Set(),
    extra = {},
  } = {}
) => {
  const inv = inventory.find((entry) => entry?.materialId === item.materialId);
  const isIncomingRequest = isIncomingTransfer(item);
  const acceptedData = acceptedTransactions[item.id] || {};
  const isAccepted = isTransferAccepted(item, acceptedSet);
  const isNew = isIncomingRequest ? isTransactionNew(item, viewedSet) : false;
  const needsAccept = isIncomingRequest && !isAccepted;

  return {
    ...item,
    ...extra,
    materialName: inv?.material?.name || item.materialId || "-",
    transactionDateFormatted: formatStoreDate(item.transactionDate),
    flowStore: formatTransactionFlow(item, currentStore),
    reference: formatTransactionReference(item),
    documentUrl: item.documentUrl || null,
    isIncomingRequest,
    isAccepted,
    needsAccept,
    requestStatus: isIncomingRequest
      ? isAccepted
        ? "Accepted"
        : "Incoming"
      : "",
    action: needsAccept ? "accept" : "",
    receivingNotes:
      acceptedData.notes || extractReceivingNotes(item.notes) || "",
    receivedDocuments: buildReceivingDocuments(item, acceptedData),
    isNew,
  };
};

export const shouldShowActionColumn = (rows) =>
  rows.some((row) => row.needsAccept || row.isNew);
