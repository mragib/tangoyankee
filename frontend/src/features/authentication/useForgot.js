import { useMutation } from "@tanstack/react-query";
import { forgotPassword as forgotPasswordApi } from "../../services/apiUser";

export function useForgot() {
  const {
    mutate: forgetPassword,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: forgotPasswordApi,
    onError: (err) => err,
  });

  return { forgetPassword, isLoading, error, isError };
}
