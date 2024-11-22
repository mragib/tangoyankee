import { useQuery } from "@tanstack/react-query";
import { getAttributeSets } from "../../services/apiAttributeSet";

function useAttributeSets() {
  const {
    isPending: isLoading,
    data: attribute_sets = [],
    error,
  } = useQuery({
    queryKey: ["attribute-sets"],
    queryFn: getAttributeSets,
  });
  return { isLoading, attribute_sets, error };
}

export default useAttributeSets;
