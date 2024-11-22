import axios from "axios";
import { ATTRIBUTE_URL } from "../static";
import { addAndEdit } from "@/util";

export async function getAttribute() {
  const res = await axios.get(ATTRIBUTE_URL);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function deleteAttribute(id) {
  const res = await axios.delete(`${ATTRIBUTE_URL}/${id}`);

  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function addAndEditAttribute(newData, id) {
  return await addAndEdit({ id, newData, url: ATTRIBUTE_URL });
}
