import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createSupplierPayment as createPaymentApi } from "../../services/apiPayment";
import { useParams } from "react-router-dom";

function usePayPurchaseAmount() {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const { mutate: createPayment, isPending: isCreating } = useMutation({
    mutationFn: createPaymentApi,
    onSuccess: () => {
      toast.success("A new payment has made");
      queryClient.invalidateQueries({
        queryKey: ["purchase", id],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createPayment };
}

export default usePayPurchaseAmount;
