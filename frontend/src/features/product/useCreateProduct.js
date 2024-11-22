import { addAndEditProduct } from "@/services/apiProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateProduct() {
  const queryClient = useQueryClient();
  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: addAndEditProduct,
    onSuccess: () => {
      toast.success("New product has been created");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createProduct };
}

export default useCreateProduct;
