import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteAttributeSet as deleteAttributeSetApi } from "../../services/apiAttributeSet";

function useDeleteAttributeSet() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteAttributeSet } = useMutation({
    mutationFn: (id) => deleteAttributeSetApi(id),
    onSuccess: () => {
      toast.success("Attribute set has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["attribute-sets"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteAttributeSet };
}

export default useDeleteAttributeSet;
