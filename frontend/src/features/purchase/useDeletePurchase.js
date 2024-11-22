import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePurchase as deletePurchaseApi } from "../../services/apiPurchase";

function useDeletePurchase() {
  const queryClient = useQueryClient();

  const { mutate: deletePurchase, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => deletePurchaseApi(id),
    onSuccess: () => {
      toast.success("Purchase has been deleted");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deletePurchase, isDeleting };
}

export default useDeletePurchase;
