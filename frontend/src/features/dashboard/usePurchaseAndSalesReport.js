import { getPurchaseSalesReport } from "@/services/apiDashboard";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";

function usePurchaseAndSalesReport() {
  const [searchParam] = useSearchParams();

  const numOfDays = !searchParam.get("last")
    ? 7
    : Number(searchParam.get("last"));

  const endDate = new Date().toISOString();
  const startDate = subDays(endDate, numOfDays).toISOString();

  const {
    isPending: isLoading,
    data: purchaseSalesReport,
    error,
  } = useQuery({
    queryKey: ["purchase-sales-report", `last-${numOfDays}`],
    queryFn: () => getPurchaseSalesReport({ startDate, endDate }),
  });

  return { isLoading, purchaseSalesReport, error };
}

export default usePurchaseAndSalesReport;
