import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteUser as deleteUserApi } from "../../services/apiUser";

function useDeleteUser() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteUser } = useMutation({
    mutationFn: (id) => deleteUserApi(id),
    onSuccess: () => {
      toast.success("User has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteUser };
}

export default useDeleteUser;
