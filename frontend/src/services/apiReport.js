import {
  CUSTOMER_PAYMENT_PLAN_URL,
  DAILYSTATEMENT,
  SEARCH_URL,
  SUPPLIER_PAYMENT_PLAN_URL,
} from "@/static";
import { addAndEdit } from "@/util";
import axios from "axios";

export async function getStatement({ startDate, endDate }) {
  if (startDate && endDate) {
    const res = await axios.get(
      `${DAILYSTATEMENT}?startDate=${startDate}&endDate=${endDate}`
    );

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } else if (startDate) {
    const res = await axios.get(`${DAILYSTATEMENT}?startDate=${startDate}`);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } else if (endDate) {
    const res = await axios.get(`${DAILYSTATEMENT}?startDate=${endDate}`);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } else {
    const res = await axios.get(`${DAILYSTATEMENT}`);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  }
}

export async function getCustomersPaymentDueDateReport() {
  const res = await axios.get(`${CUSTOMER_PAYMENT_PLAN_URL}/customer-due-date`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}
export async function getSupplierPaymentDueDateReport() {
  const res = await axios.get(`${SUPPLIER_PAYMENT_PLAN_URL}/supplier-due-date`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function globalSearch(text) {
  return addAndEdit({ url: SEARCH_URL, newData: { text } });
}
