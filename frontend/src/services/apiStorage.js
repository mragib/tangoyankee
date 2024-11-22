import { STORAGE_URL } from "../static";
import { addAndEdit, fetchData } from "@/util";

export async function getStorage() {
  return fetchData({ url: STORAGE_URL });
}

// export async function deleteAttributeSet(id) {
//   const res = await axios.delete(`${STORAGE_URL}/${id}`);

//   if (res.status !== 200) throw new Error("Something went wrong!🔥");
//   return res.data;
// }

export async function addAndEditStorage(newData, id) {
  return addAndEdit({ url: STORAGE_URL, id, newData });
}
