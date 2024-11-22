import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { createCustomerPayment as createCustomerPaymentApi } from "../../services/apiPayment";

function usePayCustomerAmount() {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const { mutate: createCustomerPayment, isPending: isCreating } = useMutation({
    mutationFn: createCustomerPaymentApi,
    onSuccess: () => {
      toast.success("Customer has made a payment");
      queryClient.invalidateQueries({
        queryKey: ["sale", id],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createCustomerPayment };
}

export default usePayCustomerAmount;
