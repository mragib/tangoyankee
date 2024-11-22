import { getProducts } from "@/services/apiProduct";
import { useQuery } from "@tanstack/react-query";

function useProduct() {
  const {
    isPending: isLoading,
    data: products = [],
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return { isLoading, products, error };
}

export default useProduct;
