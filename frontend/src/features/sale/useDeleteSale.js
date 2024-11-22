import { deleteSale as deleteSaleApi } from "@/services/apiSales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useDeleteSale() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteSale } = useMutation({
    mutationFn: (id) => deleteSaleApi(id),
    onSuccess: () => {
      toast.success("Sale has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["deliveries"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteSale };
}

export default useDeleteSale;
