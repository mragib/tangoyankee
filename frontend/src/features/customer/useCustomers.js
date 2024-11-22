import { getCustomers } from "../../services/apiCustomer";
import { useQuery } from "@tanstack/react-query";

function useCustomers() {
  const {
    isPending: isLoading,
    data: customers = [],
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return { isLoading, customers, error };
}

export default useCustomers;
