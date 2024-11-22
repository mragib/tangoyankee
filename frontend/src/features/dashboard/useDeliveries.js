import { getDeliveries } from "@/services/apiDelivery";
import { useQuery } from "@tanstack/react-query";

function useDeliveries() {
  const {
    isPending: isLoading,
    data: deliveries,
    error,
  } = useQuery({
    queryKey: ["deliveries"],
    queryFn: getDeliveries,
  });

  return { isLoading, deliveries, error };
}

export default useDeliveries;
