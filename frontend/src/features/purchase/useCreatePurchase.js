import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAndEditPurchase } from "../../services/apiPurchase";
import toast from "react-hot-toast";

function useCreatePurchase() {
  const queryClient = useQueryClient();
  const { mutate: createPurchase, isPending: isCreating } = useMutation({
    mutationFn: addAndEditPurchase,
    onSuccess: () => {
      toast.success("A New Purchase has been created");
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createPurchase };
}

export default useCreatePurchase;
