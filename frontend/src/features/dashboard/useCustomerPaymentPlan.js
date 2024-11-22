import { getCustomersPaymentDueDateReport } from "@/services/apiReport";
import { useQuery } from "@tanstack/react-query";

function useCustomerPaymentPlan() {
  const {
    isPending: isLoading,
    data: customerPaymentPlans,
    error,
  } = useQuery({
    queryKey: ["customer-payment-plan"],
    queryFn: getCustomersPaymentDueDateReport,
  });

  return { isLoading, customerPaymentPlans, error };
}

export default useCustomerPaymentPlan;
