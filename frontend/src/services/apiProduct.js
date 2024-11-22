import { PRODUCT_URL } from "../static";
import { addAndEdit, deleteData, fetchData } from "@/util";

export async function getProducts() {
  return fetchData({ url: PRODUCT_URL });
}

export async function deleteProduct(id) {
  return deleteData({ id, url: PRODUCT_URL });
}

export async function addAndEditProduct(newData, id) {
  return addAndEdit({ id, newData, url: PRODUCT_URL });
}
