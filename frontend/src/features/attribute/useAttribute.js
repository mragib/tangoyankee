import { getAttribute } from "@/services/apiAttribute";
import { useQuery } from "@tanstack/react-query";

function useAttribute() {
  const {
    isPending: isLoading,
    data: attribute,
    error,
  } = useQuery({
    queryKey: ["attributes"],
    queryFn: getAttribute,
  });
  return { isLoading, attribute, error };
}

export default useAttribute;
