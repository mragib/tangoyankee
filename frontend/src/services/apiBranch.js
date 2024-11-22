import axios from "axios";
import { BRANCH_URL } from "../static";
import { addAndEdit } from "@/util";

export async function getBranchs() {
  const res = await axios.get(BRANCH_URL);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function deleteBranch(id) {
  const res = await axios.delete(`${BRANCH_URL}/${id}`);

  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function addAndEditBranch(newData, id) {
  return await addAndEdit({ id, newData, url: BRANCH_URL });
}
