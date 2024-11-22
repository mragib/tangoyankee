import { reset } from "@/services/apiUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useChangePassword() {
  const queryClient = useQueryClient();

  const { mutate: changeUserPassword, isPending: isEditing } = useMutation({
    mutationFn: reset,
    onSuccess: () => {
      toast.success("Password has been updated");
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, changeUserPassword };
}

export default useChangePassword;
