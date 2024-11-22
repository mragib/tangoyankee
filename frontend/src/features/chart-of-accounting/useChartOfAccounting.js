import { getChartOfAccounting } from "@/services/apiChartOfAccounting";
import { useQuery } from "@tanstack/react-query";

function useChartOfAccounting() {
  const {
    isPending: isLoading,
    data: chartOfAccounting,
    error,
  } = useQuery({
    queryKey: ["chartOfAccounting"],
    queryFn: getChartOfAccounting,
  });
  return { isLoading, chartOfAccounting, error };
}

export default useChartOfAccounting;
