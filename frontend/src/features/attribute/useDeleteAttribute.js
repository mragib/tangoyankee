import { deleteAttribute as deleteAttributeApi } from "@/services/apiAttribute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useDeleteAttribute() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteAttribute } = useMutation({
    mutationFn: (id) => deleteAttributeApi(id),
    onSuccess: () => {
      toast.success("Attribute has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["attributes"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteAttribute };
}

export default useDeleteAttribute;
