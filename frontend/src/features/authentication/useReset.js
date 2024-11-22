import { useMutation } from "@tanstack/react-query";
import { reset as resetApi } from "../../services/apiUser";
import { useNavigate } from "react-router-dom";

export function useReset() {
  const navigator = useNavigate();
  const {
    mutate: reset,
    isLoading: isReseting,
    isError,
    error,
  } = useMutation({
    mutationFn: resetApi,
    onSuccess: () => {
      navigator("/login", { replace: true });
    },
  });
  return { reset, isReseting, isError, error };
}
