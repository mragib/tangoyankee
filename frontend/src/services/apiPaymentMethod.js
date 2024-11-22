import axios from "axios";
import { BANK_TRANSFER, PAYMENT_METHOD_URL } from "../static";
import { addAndEdit, deleteData, fetchData } from "@/util";

export async function getPaymentMethods() {
  return fetchData({ url: PAYMENT_METHOD_URL });
}

export async function deletePaymentMethod(id) {
  return deleteData({ url: PAYMENT_METHOD_URL, id });
}

export async function addAndEditPaymentMethod(newData, id) {
  return addAndEdit({ id, newData, url: PAYMENT_METHOD_URL });
}

export async function transferFunds(newData) {
  const res = await axios.post(BANK_TRANSFER, newData);

  if (res.status !== 201) throw new Error(res);
  return res.data;
}
