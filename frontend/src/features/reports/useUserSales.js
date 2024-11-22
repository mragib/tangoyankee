import { getSalesByUser } from "@/services/apiSales";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

function useUserSales() {
  // const [searchParam] = useSearchParams();

  // const startDate = searchParam.get("startDate") || null;
  // const endDate = searchParam.get("endDate") || null;
  // const status = searchParam.get("status") || null;

  const {
    isPending: isLoading,
    data: salesReportOfUser,
    error,
  } = useQuery({
    queryKey: ["sales-report-by-user"],
    queryFn: getSalesByUser,
  });
  return { isLoading, salesReportOfUser, error };
}

export default useUserSales;
