import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteSupplier as deleteSupplierApi } from "../../services/apiSupplier";

function useDeleteSupplier() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteSupplier } = useMutation({
    mutationFn: (id) => deleteSupplierApi(id),
    onSuccess: () => {
      toast.success("Supplier has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteSupplier };
}

export default useDeleteSupplier;
