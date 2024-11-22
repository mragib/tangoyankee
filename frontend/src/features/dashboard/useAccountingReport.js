import { getAssetsReport } from "@/services/apiDashboard";
import { useQuery } from "@tanstack/react-query";

function useAccountingReport() {
  const {
    isPending: isLoading,
    data: assets,
    error,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssetsReport,
  });

  return { isLoading, assets, error };
}

export default useAccountingReport;
