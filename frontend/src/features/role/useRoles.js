import { getRoles } from "@/services/apiRole";
import { useQuery } from "@tanstack/react-query";

function useRoles() {
  const {
    isPending: isLoading,
    data: roles,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });
  return { isLoading, roles, error };
}

export default useRoles;
