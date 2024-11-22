import { getExpenses } from "@/services/apiExpense";
import { useQuery } from "@tanstack/react-query";

function useExpenses() {
  const {
    isPending: isLoading,
    data: expenses,
    error,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });
  return { isLoading, expenses, error };
}

export default useExpenses;
