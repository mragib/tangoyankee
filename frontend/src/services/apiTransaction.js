import { TRANSACTION_URL } from "@/static";
import axios from "axios";

export async function getTransaction({ startDate, endDate }) {
  if (startDate && endDate) {
    const res = await axios.get(
      `${TRANSACTION_URL}?startDate=${startDate}&endDate=${endDate}`
    );

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } else if (startDate) {
    const res = await axios.get(`${TRANSACTION_URL}?startDate=${startDate}`);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } else if (endDate) {
    const res = await axios.get(`${TRANSACTION_URL}?startDate=${endDate}`);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } else {
    const res = await axios.get(`${TRANSACTION_URL}`);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  }
}
