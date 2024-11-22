import { useQuery } from "@tanstack/react-query";
import { getSuppliers as getSuppliersAPi } from "../../services/apiSupplier";

function useSuppliers() {
  const {
    isPending: isLoading,
    data: suppliers,
    error,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliersAPi,
  });

  return { isLoading, suppliers, error };
}

export default useSuppliers;
