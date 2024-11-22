import axios from "axios";
import { PRODUCT_WITH_LAST_PURCHASE_PRICE, PURCHASE_URL } from "../static";

export async function getPurchases() {
  const res = await axios.get(PURCHASE_URL);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");

  return res.data;
}

export async function getPurchase(id) {
  const res = await axios.get(`${PURCHASE_URL}/${id}`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function getProductBuyingPrice() {
  const res = await axios.get(PRODUCT_WITH_LAST_PURCHASE_PRICE);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");

  return res.data;
}

export async function addAndEditPurchase(newData, id) {
  if (!id) {
    const res = await axios.post(PURCHASE_URL, newData);

    if (res.status !== 201) throw new Error(res.response.data.message);
    return res.data;
  }
  if (id) {
    const res = await axios.patch(`${PURCHASE_URL}/${id}`, newData);

    if (res.status !== 200) throw new Error(res.response.data.message);
    return res.data;
  }
}

export async function deletePurchase(id) {
  const res = await axios.delete(`${PURCHASE_URL}/${id}`);

  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}
