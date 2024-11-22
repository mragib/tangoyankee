import { deleteProduct as deleteProductApi } from "@/services/apiProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useDeleteProduct() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteProduct } = useMutation({
    mutationFn: (id) => deleteProductApi(id),
    onSuccess: () => {
      toast.success("Product has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteProduct };
}

export default useDeleteProduct;
