import { getProductBuyingPrice } from "@/services/apiPurchase";
import { useQuery } from "@tanstack/react-query";

function useProductBuyingUnitPrice() {
  const {
    isPending: isLoading,
    data: buyingUnitPrice,
    error,
  } = useQuery({
    queryKey: ["ProductBuyingPrice"],
    queryFn: getProductBuyingPrice,
  });
  return { isLoading, buyingUnitPrice, error };
}

export default useProductBuyingUnitPrice;
