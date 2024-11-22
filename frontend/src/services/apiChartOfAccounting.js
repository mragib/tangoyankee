import { CHART_OF_ACCOUNTING } from "@/static";
import axios from "axios";

export async function getChartOfAccounting() {
  const res = await axios.get(CHART_OF_ACCOUNTING);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function addAndEditChartOfAccounting(newData, id) {
  if (!id) {
    const res = await axios.post(CHART_OF_ACCOUNTING, newData);

    if (res.status !== 201)
      throw new Error(res.response?.data?.message || "Something went wrong!🔥");
    return res.data;
  }
  if (id) {
    const res = await axios.patch(`${CHART_OF_ACCOUNTING}/${id}`, newData);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  }
}

export async function allDataInsert(data) {
  try {
    const response = await axios.post(
      `${CHART_OF_ACCOUNTING}/upload-csv`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
}
