import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSupplier } from "../../services/apiSupplier";

function useSupplier() {
  const { id } = useParams();
  const {
    isPending: isLoading,
    data: supplier,
    error,
  } = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplier(id),
  });
  return { isLoading, supplier, error };
}

export default useSupplier;
