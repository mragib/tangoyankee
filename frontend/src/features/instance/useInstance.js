import { getInstances } from "@/services/apiInstance";
import { useQuery } from "@tanstack/react-query";

function useInstance() {
  const {
    isPending: isLoading,
    data: instances = [],
    error,
  } = useQuery({
    queryKey: ["instances"],
    queryFn: getInstances,
  });
  return { isLoading, instances, error };
}

export default useInstance;
