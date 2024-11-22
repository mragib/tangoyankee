import { INSTANCE_URL } from "../static";
import { addAndEdit, deleteData, fetchData } from "@/util";

export async function getInstances() {
  return fetchData({ url: INSTANCE_URL });
}

export async function deleteInstance(id) {
  return deleteData({ id, url: INSTANCE_URL });
}

export async function addAndEditInstance(newData, id) {
  return addAndEdit({ id, newData, url: INSTANCE_URL });
}
