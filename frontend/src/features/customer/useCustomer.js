import { getCustomer as getCustomerApi } from "@/services/apiCustomer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function useCustomer() {
  const { id } = useParams();
  const {
    isPending: isLoading,
    data: customer,
    error,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerApi(id),
  });
  return { isLoading, customer, error };
}

export default useCustomer;
