import { getStorage } from "@/services/apiStorage";
import { useQuery } from "@tanstack/react-query";

function useStorage() {
  const {
    isPending: isLoading,
    data: storage = [],
    error,
  } = useQuery({
    queryKey: ["storage"],
    queryFn: getStorage,
  });
  return { isLoading, storage, error };
}

export default useStorage;
