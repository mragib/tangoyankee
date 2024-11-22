import { getPaymentMethods } from "@/services/apiPaymentMethod";
import { useQuery } from "@tanstack/react-query";

function usePaymentMethod() {
  const {
    isPending: isLoading,
    data: paymentMethods = [],
    error,
  } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  });
  return { isLoading, paymentMethods, error };
}

export default usePaymentMethod;
