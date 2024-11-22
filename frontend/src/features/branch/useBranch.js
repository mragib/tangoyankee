import { getBranchs } from "@/services/apiBranch";
import { useQuery } from "@tanstack/react-query";

function useBranch() {
  const {
    isPending: isLoading,
    data: branch,
    error,
  } = useQuery({
    queryKey: ["branches"],
    queryFn: getBranchs,
  });
  return { isLoading, branch, error };
}

export default useBranch;
