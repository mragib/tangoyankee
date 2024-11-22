import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../../services/apiPurchase";

function usePurchases() {
  const {
    isPending: isLoading,
    data: purchases,
    error,
  } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => getPurchases(),
  });
  return { isLoading, purchases, error };
}

export default usePurchases;
