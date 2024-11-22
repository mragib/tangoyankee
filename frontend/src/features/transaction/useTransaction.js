import { getTransaction } from "@/services/apiTransaction";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

function useTransaction() {
  const [searchParam] = useSearchParams();

  const startDate = searchParam.get("startDate") || null;
  const endDate = searchParam.get("endDate") || null;

  const {
    isPending: isLoading,
    data: transactions,
    error,
  } = useQuery({
    queryKey: ["transactions", startDate, endDate],
    queryFn: () => getTransaction({ startDate, endDate }),
  });
  return { isLoading, transactions, error };
}

export default useTransaction;
