import { EXPENSE_URL } from "@/static";
import axios from "axios";

export async function getExpenses() {
  const res = await axios.get(EXPENSE_URL);
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function createExpense(newData) {
  const res = await axios.post(EXPENSE_URL, newData);

  if (res.status !== 201) throw new Error(res.response.data.message);
  return res.data;
}
