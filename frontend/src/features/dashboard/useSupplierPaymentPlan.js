import { getSupplierPaymentDueDateReport } from "@/services/apiReport";
import { useQuery } from "@tanstack/react-query";

function useSupplierPaymentPlan() {
  const {
    isPending: isLoading,
    data: supplierPaymentPlans,
    error,
  } = useQuery({
    queryKey: ["supplier-payment-plan"],
    queryFn: getSupplierPaymentDueDateReport,
  });

  return { isLoading, supplierPaymentPlans, error };
}

export default useSupplierPaymentPlan;
