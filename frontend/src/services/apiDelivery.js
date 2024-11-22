import { DELIVERY_URL } from "@/static";
import { fetchData } from "@/util";
import axios from "axios";

export async function getDeliveries() {
  return fetchData({ url: DELIVERY_URL });
}

export async function updateDelivery(updatedData, id) {
  const res = await axios.patch(`${DELIVERY_URL}/${id}`, updatedData);

  if (res.status !== 200) throw new Error(res.response.data.message);
  return res.data;
}
