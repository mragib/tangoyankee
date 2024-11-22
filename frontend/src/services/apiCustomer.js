import { addAndEdit, deleteData, fetchData } from "@/util";
import { CUSTOMER_PAY, CUSTOMER_URL } from "../static";
import axios from "axios";

export async function getCustomers() {
  return fetchData({ url: CUSTOMER_URL });
}

// export async function getCustomer(id) {
//   const res = await axios.get(`${CUSTOMER_URL}/phone/${id}`);
//   if (res.status !== 200) throw new Error("Something went wrong!🔥");
//   return res.data;
// }
export async function getCustomer(id) {
  const res = await axios.get(`${CUSTOMER_URL}/${id}`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function deleteCustomer(id) {
  // const res = await axios.delete(`${CUSTOMER_URL}/${id}`);

  // if (res.status !== 200) throw new Error("Something went wrong!🔥");
  // return res.data;
  return deleteData({ url: CUSTOMER_URL, id });
}

export async function addAndEditCustomer(newData, id) {
  return addAndEdit({ url: CUSTOMER_URL, id, newData });
}

export async function changeCustomerStatus(newData, id) {
  if (id) {
    const res = await axios.patch(`${CUSTOMER_URL}/status/${id}`, newData);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  }
}

export async function payBills(data) {
  const res = await axios.post(CUSTOMER_PAY, data);

  if (res.status !== 201)
    throw new Error(
      res.response.data
        ? res.response.data.message[0]
        : "Something went wrong!🔥"
    );
  return res.data;
}
