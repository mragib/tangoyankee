import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiUser";
import toast from "react-hot-toast";

export function useRegister() {
  const queryClient = useQueryClient();
  const {
    mutate: signUp,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success("A New User has been created");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { signUp, isLoading, error };
}
