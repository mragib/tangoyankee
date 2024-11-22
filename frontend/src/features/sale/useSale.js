import { getSale } from "@/services/apiSales";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function useSale() {
  const { id } = useParams();
  const {
    isPending: isLoading,
    data: sale = {},
    error,
  } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => getSale(id),
  });
  return { isLoading, sale, error };
}

export default useSale;
