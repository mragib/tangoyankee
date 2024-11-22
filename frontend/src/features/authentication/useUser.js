import { useQuery } from "@tanstack/react-query";
import { getUser as getUserApi } from "../../services/apiUser";

export function useUser() {
  const {
    data: user,
    isPending: isGetingUser,
    error,
  } = useQuery({
    queryFn: getUserApi,
    queryKey: ["me"],
  });

  return { user, isGetingUser, error };
}
