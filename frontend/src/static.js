// Api endpoints
export const ATTRIBUTE_SET_URL = "attribute-set";
export const INSTANCE_URL = "instance";
export const PRODUCT_URL = "product";
export const STORAGE_URL = "storage";
export const ATTRIBUTE_URL = "attribute";
export const BRANCH_URL = "locator";

export const CUSTOMER_URL = "customer";
export const CUSTOMER_PAY = "sale-revenue/pay-bills";
export const CUSTOMER_PAYMENT_URL = "sale-revenue";
export const CUSTOMER_PAYMENT_PLAN_URL = "customer-payment-plan";

export const SUPPLIER_URL = "supplier";
export const SUPPLIER_PAYMENT_URL = "payments";
export const SUPPLIER_PAY = "payments/make-payment";
export const SUPPLIER_PAYMENT_PLAN_URL = "supplier-payment-plan";

export const PURCHASE_URL = "purchase";

export const PAYMENT_METHOD_URL = "accounts";

export const SALE_URL = "sales";

export const CHART_OF_ACCOUNTING = "chartofaccounting";
export const BANK_TRANSFER = `${PAYMENT_METHOD_URL}/transfer`;

export const EXPENSE_URL = "expense";

export const TRANSACTION_URL = "transactions";

export const DAILYSTATEMENT = "dailty-statement";

export const COMPANY_ADDRESS = "Beribadh, Mohammadpur, Dhaka";

export const PRODUCT_WITH_LAST_PURCHASE_PRICE =
  ATTRIBUTE_URL + "/productWithLastPurchasePrice";

export const DELIVERY_URL = "delivery";

export const ROLE_URL = "role";

export const USER_PASSWORD_CHANGE = "change-password";

export const SEARCH_URL = "search";
export const PURCHASE_EXPENSE_CODE = 5200;

// Enums
export const TransactionType = {
  TRANSFER: "TRANSFER",
  WITHDRAW: "WITHDRAW",
  DEPOSIT: "DEPOSIT",
  PURCHASE: "PURCHASE",
  SALE: "SALE",
  PAYMENT: "PAYMENT",
  RECEIPT: "RECEIPT",
  ADJUSTMENT: "ADJUSTMENT",
  OPENING_BALANCE: "OPENING_BALANCE",
  CLOSING_BALANCE: "CLOSING_BALANCE",
  REFUND: "REFUND",
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
};

export const Colors = {};
Colors.names = {
  aqua: "#00ffff",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  black: "#000000",
  blue: "#0000ff",
  brown: "#a52a2a",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgrey: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkviolet: "#9400d3",
  fuchsia: "#ff00ff",
  gold: "#ffd700",
  green: "#008000",
  indigo: "#4b0082",
  khaki: "#f0e68c",
  lightblue: "#add8e6",
  lightcyan: "#e0ffff",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  magenta: "#ff00ff",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  orange: "#ffa500",
  pink: "#ffc0cb",
  purple: "#800080",
  violet: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  white: "#ffffff",
  yellow: "#ffff00",
};

export const deliveryStatusForSelect = [
  {
    value: "Delivered",
    label: "Delivered",
  },
  { value: "Order Received", label: "Order Received" },
  { value: "Processing", label: "Processing" },
  {
    value: "Shipped",
    label: "Shipped",
  },

  {
    value: "Returned",
    label: "Returned",
  },
];

export const DeliveryAction = {
  PURCHASE: "PURCHASE",
  SALE: "SALE",
};

export const DeliveryCharge = [
  {
    value: "80",
    label: "Dhaka",
  },
  {
    value: "120",
    label: "Outside",
  },
  {
    value: "300",
    label: "Emergency",
  },
];
