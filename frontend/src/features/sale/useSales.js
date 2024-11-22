import { getSales } from "@/services/apiSales";
import { useQuery } from "@tanstack/react-query";

function useSales() {
  const {
    isPending: isLoading,
    data: sales,
    error,
  } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  return { isLoading, sales, error };
}

export default useSales;
