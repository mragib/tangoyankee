import { SALE_URL } from "@/static";
import { addAndEdit, deleteData, fetchData } from "@/util";
import axios from "axios";

export async function getSales() {
  return fetchData({ url: SALE_URL });
}
export async function getSale(id) {
  const res = await axios.get(`${SALE_URL}/${id}`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");

  return res.data;
}

export async function addAndEditSale(newData, id) {
  return addAndEdit({ url: SALE_URL, id, newData });
}

export async function getSalesByUser() {
  return fetchData({ url: `${SALE_URL}/soldByUser` });
}

export async function editSale(updatedData, id) {
  return addAndEdit({ url: "sales", id, newData: updatedData });
}

export async function deleteSale(id) {
  return deleteData({ url: SALE_URL, id });
}
