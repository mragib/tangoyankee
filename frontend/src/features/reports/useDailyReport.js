import { getStatement } from "@/services/apiReport";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

function useDailyReport() {
  const [searchParam] = useSearchParams();

  const startDate = searchParam.get("startDate") || null;
  const endDate = searchParam.get("endDate") || null;

  const {
    isPending: isLoading,
    data: statement,
    error,
  } = useQuery({
    queryKey: ["daily-reports", startDate, endDate],
    queryFn: () => getStatement({ startDate, endDate }),
  });
  return { isLoading, statement, error };
}

export default useDailyReport;
