import { CHART_OF_ACCOUNTING } from "@/static";
import axios from "axios";

export async function getAssetsReport() {
  const res = await axios.get(`${CHART_OF_ACCOUNTING}/report`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function getPurchaseSalesReport({
  startDate = null,
  endDate = null,
}) {
  let URL = "purchase-sales-report";
  if (startDate && endDate) {
    const res = await axios.get(
      `${URL}?startDate=${startDate}&&endDate=${endDate}`
    );
    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } else if (startDate) {
    const res = await axios.get(
      `${URL}?startDate=${startDate}&&endDate=${startDate}`
    );
    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } else if (endDate) {
    const res = await axios.get(
      `${URL}?startDate=${endDate}&&endDate=${endDate}`
    );
    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  }
  const today = new Date();
  const res = await axios.get(`${URL}?startDate=${today}&&endDate=${today}`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}
