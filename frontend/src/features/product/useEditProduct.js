import { addAndEditProduct } from "@/services/apiProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditProduct() {
  const queryClient = useQueryClient();

  const { mutate: editProduct, isPending: isEditing } = useMutation({
    mutationFn: ({ newProductData, id }) =>
      addAndEditProduct(newProductData, id),
    onSuccess: () => {
      toast.success("The product has been updated");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editProduct };
}

export default useEditProduct;
