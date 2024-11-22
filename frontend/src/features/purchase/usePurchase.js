import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPurchase } from "../../services/apiPurchase";

function usePurchase() {
  const { id } = useParams();
  const {
    isPending: isLoading,
    data: purchase,
    error,
  } = useQuery({
    queryKey: ["purchase", id],
    queryFn: () => getPurchase(id),
  });
  return { isLoading, purchase, error };
}

export default usePurchase;
