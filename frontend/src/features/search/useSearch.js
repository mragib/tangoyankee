import { globalSearch as globalSearchApi } from "@/services/apiReport";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useSearch() {
  const queryClient = useQueryClient();
  const { mutate: globalSearch, isPending: isSearching } = useMutation({
    mutationFn: globalSearchApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["search"],
      });
    },
  });
  return { isSearching, globalSearch };
}

export default useSearch;
