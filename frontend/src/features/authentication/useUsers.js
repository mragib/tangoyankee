import { useQuery } from "@tanstack/react-query";
import { getUsers as getUsersApi } from "../../services/apiUser";

function useUsers() {
  const {
    data: users,
    isPending: isLoading,
    error,
  } = useQuery({
    queryFn: getUsersApi,
    queryKey: ["users"],
  });

  return { users, isLoading, error };
}

export default useUsers;
