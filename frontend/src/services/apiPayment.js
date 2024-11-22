import axios from "axios";
import { CUSTOMER_PAYMENT_URL, SUPPLIER_PAYMENT_URL } from "../static";

export async function createSupplierPayment(newData) {
  const res = await axios.post(SUPPLIER_PAYMENT_URL, newData);

  if (res.status !== 201) throw new Error(res.response.data.message);
  return res.data;
}

export async function getSupplierPayments() {
  const res = await axios.get(SUPPLIER_PAYMENT_URL);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function getCustomerPayments() {
  const res = await axios.get(CUSTOMER_PAYMENT_URL);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function createCustomerPayment(newData) {
  const res = await axios.post(CUSTOMER_PAYMENT_URL, newData);

  if (res.status !== 201) throw new Error(res.response.data.message);
  return res.data;
}
