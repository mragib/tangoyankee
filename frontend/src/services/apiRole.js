import { ROLE_URL } from "@/static";
import axios from "axios";

export async function getRoles() {
  const res = await axios.get(ROLE_URL);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function getRole(id) {
  const res = await axios.get(`${ROLE_URL}/${id}`);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function addAndEditRole(newData, id) {
  if (!id) {
    const res = await axios.post(ROLE_URL, newData);

    if (res.status !== 201) throw new Error(res.response.data.message);
    return res.data;
  }
  if (id) {
    const res = await axios.patch(`${ROLE_URL}/${id}`, newData);

    if (res.status !== 200) throw new Error(res.response.data.message);
    return res.data;
  }
}
