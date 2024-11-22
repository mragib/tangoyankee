import { deleteInstance as deleteInstanceApi } from "@/services/apiInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useDeleteInstance() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteInstance } = useMutation({
    mutationFn: (id) => deleteInstanceApi(id),
    onSuccess: () => {
      toast.success("Instance has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["instances"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteInstance };
}

export default useDeleteInstance;
