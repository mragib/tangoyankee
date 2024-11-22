import axios from "axios";
import { SUPPLIER_PAY, SUPPLIER_URL } from "../static";
import { addAndEdit, deleteData, fetchData } from "@/util";

export async function getSuppliers() {
  return fetchData({ url: SUPPLIER_URL });
}

export async function addAndEditSupplier(newData, id) {
  return addAndEdit({ id, newData, url: SUPPLIER_URL });
}

export async function deleteSupplier(id) {
  // const res = await axios.delete(`${SUPPLIER_URL}/${id}`);

  // if (res.status !== 200) throw new Error("Something went wrong!🔥");
  // return res.data;
  return deleteData({ url: SUPPLIER_URL, id });
}

export async function changeSupplierStatus(newData, id) {
  // if (id) {
  //   const res = await axios.patch(`${SUPPLIER_URL}/status/${id}`, newData);

  //   if (res.status !== 200) throw new Error("Something went wrong!🔥");
  //   return res.data;
  // }
  return addAndEdit({ url: `${SUPPLIER_URL}/status`, newData, id });
}

export async function getSupplier(id) {
  const res = await axios.get(`${SUPPLIER_URL}/${id}`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function makePayment(data) {
  const res = await axios.post(SUPPLIER_PAY, data);
  if (res.status !== 201) throw new Error("Something went wrong!🔥");
  return res.data;
}
