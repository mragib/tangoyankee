import { addAndEditSale } from "@/services/apiSales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateSale() {
  const queryClient = useQueryClient();
  const { mutate: createSale, isPending: isCreating } = useMutation({
    mutationFn: addAndEditSale,
    onSuccess: () => {
      toast.success("A product has been sold");
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createSale };
}

export default useCreateSale;
