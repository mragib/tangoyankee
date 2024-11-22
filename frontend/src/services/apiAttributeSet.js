import { ATTRIBUTE_SET_URL } from "../static";
import { addAndEdit, deleteData, fetchData } from "@/util";

export async function getAttributeSets() {
  const data = await fetchData({ url: ATTRIBUTE_SET_URL });

  return data;
}

export async function deleteAttributeSet(id) {
  return await deleteData({ id, url: ATTRIBUTE_SET_URL });
}

export async function addAndEditAttributeSet(newData, id) {
  return await addAndEdit({ id, newData, url: ATTRIBUTE_SET_URL });
}
